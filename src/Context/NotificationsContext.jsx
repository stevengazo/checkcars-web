import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import notificationsService from "../services/notificationsService";
import { startConnection, stopConnection, onNotificationReceived } from "../service/signalRService";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  /** Carga inicial de notificaciones y contador desde la API. */
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [list, count] = await Promise.all([
        notificationsService.list({ take: 50 }),
        notificationsService.unreadCount(),
      ]);
      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(count);
    } catch (err) {
      console.error("No se pudieron cargar las notificaciones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationsService.markRead(id);
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationsService.markAllRead();
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
    }
  }, []);

  // Carga inicial + conexión en vivo mientras haya sesión.
  useEffect(() => {
    if (!isAuthenticated) {
      loadedRef.current = false;
      setNotifications([]);
      setUnreadCount(0);
      stopConnection();
      return;
    }

    if (loadedRef.current) return;
    loadedRef.current = true;

    refresh();
    startConnection();

    const unsubscribe = onNotificationReceived((payload) => {
      setNotifications((prev) => [payload, ...prev]);
      if (!payload.isRead) setUnreadCount((c) => c + 1);
      toast.info(`${payload.title ?? "Notificación"}${payload.message ? `: ${payload.message}` : ""}`);
    });

    return () => {
      unsubscribe?.();
    };
  }, [isAuthenticated, refresh]);

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, refresh, markRead, markAllRead }),
    [notifications, unreadCount, loading, refresh, markRead, markAllRead]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (ctx === null) {
    throw new Error("useNotifications debe usarse dentro de <NotificationsProvider>.");
  }
  return ctx;
};

export default NotificationsContext;
