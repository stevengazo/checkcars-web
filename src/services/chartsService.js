// Servicio de analítica/gráficas. Encapsula /api/Charts.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const base = ENDPOINTS.CHARTS.BASE;

const chartsService = {
  /** Conteos de reportes por vehículo: [{ carId, brand, model, plate, exits, issues, crashes, returns, bookings }] */
  async reportsByCars() {
    const { data } = await http.get(`${base}/ReportsByCars`);
    return data ?? [];
  },
  /** Distribución de vehículos por marca: [{ brand, count }] */
  async carsByBrand() {
    const { data } = await http.get(`${base}/CarsByBrand`);
    return data ?? [];
  },
  /** Distribución de vehículos por tipo: [{ type, count }] */
  async carByType() {
    const { data } = await http.get(`${base}/GetCarByType`);
    return data ?? [];
  },

  /**
   * Resumen de reportes en un rango de fechas.
   * @returns {{ startDate, endDate, exits, issues, crashes }}
   */
  async reportsByDate(start, end) {
    const qs = `start=${encodeURIComponent(start)}&End=${encodeURIComponent(end)}`;
    const { data } = await http.get(`${base}/ReportsByDate?${qs}`);
    return data;
  },
};

export default chartsService;
