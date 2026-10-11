// Servicio de roles. Encapsula /api/Roles.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const rolesService = {
  /** Diccionario de roles del sistema: { roleId: roleName }. */
  async getRoles() {
    const { data } = await http.get(ENDPOINTS.ROLES.GET_ROLES);
    return data ?? {};
  },

  /** Roles asignados a un usuario: [roleName]. */
  async getUserRoles(userId) {
    const { data } = await http.get(ENDPOINTS.ROLES.userRoles(userId));
    return data ?? [];
  },

  /** Asigna un rol a un usuario. */
  async assign(userId, roleId) {
    return http.post(ENDPOINTS.ROLES.BASE, { userId, roleId });
  },

  /** Quita un rol a un usuario. */
  async remove(userId, roleId) {
    return http.del(ENDPOINTS.ROLES.BASE, { body: { userId, roleId } });
  },
};

export default rolesService;
