// Servicio de mantenimientos/servicios de vehículos. Encapsula /api/CarServices.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const carServicesService = {
  /**
   * Resumen por vehículo con servicios recientes y último retorno.
   * @returns {Array<{ carId, brand, model, plate, serviciosRecientes, ultimoRetorno }>}
   */
  async resume() {
    const { data } = await http.get(ENDPOINTS.CAR_SERVICES.RESUME);
    return data ?? [];
  },

  /** Crea un servicio para un vehículo. */
  async create(service) {
    return http.post(ENDPOINTS.CAR_SERVICES.BASE, service);
  },

  /** Elimina un servicio por id. */
  async remove(id) {
    return http.del(`${ENDPOINTS.CAR_SERVICES.BASE}/${id}`);
  },
};

export default carServicesService;
