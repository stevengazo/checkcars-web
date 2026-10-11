// Servicio de reportes de salidas/entradas. Encapsula /api/EntryExitReports.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const base = ENDPOINTS.REPORTS.ENTRY_EXIT;

const entryExitService = {
  /** Todos los reportes de salida/entrada. */
  async all() {
    const { data } = await http.get(base);
    return data ?? [];
  },

  /** Búsqueda por filtros opcionales { date, plate, author }. */
  async search({ date, plate, author } = {}) {
    const params = [];
    if (date) params.push(`date=${encodeURIComponent(date)}`);
    if (plate) params.push(`plate=${encodeURIComponent(plate)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    if (params.length === 0) return this.all();
    const { data } = await http.get(`${base}/search?${params.join("&")}`);
    return data ?? [];
  },
};

export default entryExitService;
