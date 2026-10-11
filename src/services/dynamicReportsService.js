// Servicio de reportes dinámicos. Encapsula /api/DynamicReports.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const dynamicReportsService = {
  /** Búsqueda por filtros. type es obligatorio para distinguir Exit/Entry. */
  async search({ type, plate, author, date } = {}) {
    const params = [];
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (plate) params.push(`plate=${encodeURIComponent(plate)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    if (date) params.push(`date=${encodeURIComponent(date)}`);
    const { data } = await http.get(`${ENDPOINTS.DYNAMIC_REPORTS.SEARCH}?${params.join("&")}`);
    return data ?? [];
  },

  async byCar(carId, type) {
    const q = type ? `?type=${encodeURIComponent(type)}` : "";
    const { data } = await http.get(`${ENDPOINTS.DYNAMIC_REPORTS.byCar(carId)}${q}`);
    return data ?? [];
  },

  async get(id) {
    const { data } = await http.get(`${ENDPOINTS.DYNAMIC_REPORTS.BASE}/${id}`);
    return data;
  },

  /**
   * Crea un reporte dinámico (multipart).
   * @param {string} type        "Exit" | "Entry"
   * @param {object} data         valores de los campos { key: value }
   * @param {object} photosBySlot { slotKey: File | File[] }
   * @param {string} [carId]
   */
  async create(type, data, photosBySlot = {}, carId) {
    const fd = new FormData();
    fd.append("type", type);
    fd.append("data", JSON.stringify(data ?? {}));
    if (carId) fd.append("carId", carId);
    Object.entries(photosBySlot).forEach(([slotKey, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.filter(Boolean).forEach((file) => fd.append(slotKey, file));
    });
    const { data: result, status } = await http.upload(ENDPOINTS.DYNAMIC_REPORTS.FORM, fd);
    return { result, status };
  },
};

export default dynamicReportsService;
