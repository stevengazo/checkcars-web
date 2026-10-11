// Servicio de vehículos. Encapsula las operaciones CRUD contra /api/Cars.
import http, { BASE_URL } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

/** Construye la URL pública de una imagen almacenada (servida bajo /images). */
export function carImageUrl(imagePath) {
  if (!imagePath) return null;
  const clean = String(imagePath).replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BASE_URL}/images/${clean}`;
}

const carsService = {
  /** Lista todos los vehículos. */
  async list() {
    const { data } = await http.get(ENDPOINTS.CARS.BASE);
    return data ?? [];
  },

  /** Obtiene un vehículo por id. */
  async get(id) {
    const { data } = await http.get(ENDPOINTS.CARS.byId(id));
    return data;
  },

  /** Crea un vehículo. Devuelve { data, status } para distinguir 201. */
  async create(car) {
    return http.post(ENDPOINTS.CARS.BASE, car);
  },

  /** Actualiza un vehículo existente. */
  async update(id, car) {
    return http.put(ENDPOINTS.CARS.byId(id), car);
  },

  /** Elimina (lógicamente) un vehículo. */
  async remove(id) {
    return http.del(ENDPOINTS.CARS.byId(id));
  },

  /** Sube/reemplaza la imagen del vehículo. Devuelve { imagePath }. */
  async uploadImage(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await http.upload(`${ENDPOINTS.CARS.byId(id)}/image`, formData);
    return data;
  },
};

export default carsService;
