// Servicios de reportes (entregas, averías, accidentes) construidos sobre una fábrica común.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

/** Crea un servicio de reporte con listado y búsqueda por filtros para una ruta base. */
function makeReportService(base) {
  return {
    async all() {
      const { data } = await http.get(base);
      return data ?? [];
    },
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
}

export const returnsService = makeReportService(ENDPOINTS.REPORTS.RETURNS);
export const issuesService = makeReportService(ENDPOINTS.REPORTS.ISSUE);
export const crashesService = makeReportService(ENDPOINTS.REPORTS.CRASH);

export { makeReportService };
