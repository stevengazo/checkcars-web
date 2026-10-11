import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook de datos genérico sobre la capa de servicios.
 *
 * @param {Function} serviceFn  Función async que devuelve los datos (ej. () => carsService.list()).
 * @param {object}   options    { autoFetch = true, deps = [] }
 * @returns {{ data, loading, error, refetch }}
 */
const useApi = (serviceFn, { autoFetch = true, deps = [] } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Mantiene la referencia más reciente de serviceFn sin re-crear refetch.
  const serviceRef = useRef(serviceFn);
  serviceRef.current = serviceFn;

  const refetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceRef.current(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado.");
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
};

export default useApi;
