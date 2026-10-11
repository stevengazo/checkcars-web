import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaRegBell } from "react-icons/fa";
import { useNotifications } from "../../Context/NotificationsContext";

/** Formatea la fecha de la notificación de forma compacta. */
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const NotificationBell = () => {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();

  // Cierra el panel al hacer clic fuera.
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleItemClick = (n) => {
    if (!n.isRead) markRead(n.notificationId);
    if (n.url) {
      setOpen(false);
      nav(n.url);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
        aria-label="Notificaciones"
      >
        {unreadCount > 0 ? <FaBell size={22} /> : <FaRegBell size={22} />}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
            <span className="font-semibold text-gray-700">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <p className="px-4 py-6 text-center text-sm text-gray-400">Cargando…</p>}
            {!loading && notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">No hay notificaciones</p>
            )}
            {notifications.map((n) => (
              <button
                key={n.notificationId}
                onClick={() => handleItemClick(n)}
                className={`flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  n.isRead ? "opacity-60" : "bg-blue-50/40"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="truncate font-medium text-gray-800">{n.title ?? "Notificación"}</span>
                  {!n.isRead && <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                </div>
                {n.message && <span className="text-sm text-gray-600">{n.message}</span>}
                <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
