// Servicio de autenticación. Encapsula las rutas de /api/Account.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const authService = {
  /** Inicia sesión. Devuelve el payload del backend (incluye token). */
  async login(email, password) {
    const { data } = await http.post(
      ENDPOINTS.AUTH.LOGIN,
      { email, password },
      { auth: false }
    );
    return data;
  },

  /** Registra un nuevo usuario. */
  async register(payload) {
    const { data } = await http.post(ENDPOINTS.AUTH.REGISTER, payload, { auth: false });
    return data;
  },

  /** Solicita el envío del correo de recuperación de contraseña. */
  async forgotPassword(email) {
    const { data } = await http.post(ENDPOINTS.AUTH.forgot(email), undefined, { auth: false });
    return data;
  },

  /** Restablece la contraseña con el código recibido. */
  async resetPassword(payload) {
    const { data } = await http.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload, { auth: false });
    return data;
  },
};

export default authService;
