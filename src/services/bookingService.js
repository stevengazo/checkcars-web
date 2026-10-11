// Servicio de reservas. Encapsula /api/Bookings.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const bookingService = {
  /** Lista todas las reservas. */
  async list() {
    const { data } = await http.get(ENDPOINTS.BOOKINGS.BASE);
    return data ?? [];
  },

  /** Confirma una reserva. */
  async confirm(bookingId) {
    return http.patch(`${ENDPOINTS.BOOKINGS.BASE}/confirm/${bookingId}`);
  },

  /** Cancela una reserva. */
  async cancel(bookingId) {
    return http.patch(`${ENDPOINTS.BOOKINGS.BASE}/cancel/${bookingId}`);
  },
};

export default bookingService;
