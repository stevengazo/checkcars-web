// Servicio de usuarios. Encapsula /api/Users.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const usersService = {
  /** Lista de usuarios. */
  async list() {
    const { data } = await http.get(ENDPOINTS.USERS.BASE);
    return data ?? [];
  },

  /** Diccionario { userId: userName }. */
  async dictionary() {
    const { data } = await http.get(ENDPOINTS.USERS.DIC);
    return data ?? {};
  },

  /** Crea un usuario { userName, email, password }. */
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.USERS.BASE, payload);
    return data;
  },
};

export default usersService;
