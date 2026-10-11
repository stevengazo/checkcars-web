// Servicio de definiciones de formulario. Encapsula /api/FormDefinitions.
import http from "./httpClient";
import { ENDPOINTS } from "./endpoints";

const formDefinitionsService = {
  /** Definición activa para un tipo ("Exit" | "Entry"), o null si no hay. */
  async getByType(type) {
    try {
      const { data } = await http.get(`${ENDPOINTS.FORM_DEFINITIONS.BASE}?type=${encodeURIComponent(type)}`);
      return data;
    } catch (err) {
      if (err?.status === 404) return null;
      throw err;
    }
  },

  /** Todas las definiciones. */
  async list() {
    const { data } = await http.get(ENDPOINTS.FORM_DEFINITIONS.BASE);
    return data ?? [];
  },

  /** Guarda (crea nueva versión activa) de una definición. */
  async save(definition) {
    const { data } = await http.post(ENDPOINTS.FORM_DEFINITIONS.BASE, definition);
    return data;
  },
};

export default formDefinitionsService;
