// Servicio de notificaciones. Encapsula las rutas de /api/Notifications.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const notificationsService = {
  /** Lista las notificaciones del usuario actual (más recientes primero). */
  async list({ unreadOnly = false, take = 50, skip = 0 } = {}) {
    const params = new URLSearchParams({ unreadOnly, take, skip }).toString();
    const { data } = await http.get(`${ENDPOINTS.NOTIFICATIONS.BASE}?${params}`);
    return data;
  },

  /** Devuelve el número de notificaciones no leídas. */
  async unreadCount() {
    const { data } = await http.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return data?.count ?? 0;
  },

  /** Marca una notificación como leída. */
  async markRead(id) {
    await http.patch(ENDPOINTS.NOTIFICATIONS.markRead(id));
  },

  /** Marca todas las notificaciones como leídas. */
  async markAllRead() {
    await http.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },

  /** Elimina una notificación. */
  async remove(id) {
    await http.del(`${ENDPOINTS.NOTIFICATIONS.BASE}/${id}`);
  },
};

export default notificationsService;
