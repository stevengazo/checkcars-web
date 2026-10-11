import { useState, useEffect, useCallback } from 'react';
import { rawRequest } from '../services/httpClient';

/**
 * Hook de fetch (compatibilidad). Conserva la firma original (url completa + options
 * con body ya serializado) pero delega en el cliente HTTP central, así los componentes
 * aún no migrados ganan: inyección de token, manejo de 401 y parseo seguro de body vacío.
 */
const useFetch = (url, options = {}) => {
  const {
    autoFetch = true,
    dependencies = [],
    method = 'GET',
    body,
    headers = {},
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(0);

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, status: resStatus } = await rawRequest(url, {
          method: customOptions.method || method,
          rawBody: customOptions.body !== undefined ? customOptions.body : body,
          headers: { ...headers, ...(customOptions.headers || {}) },
        });
        setStatus(resStatus);
        setData(result);
      } catch (err) {
        setStatus(err.status ?? 0);
        setData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    // Mantiene el comportamiento previo: reacciona a cambios de url/opciones.
    [url, method, body, JSON.stringify(headers)]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData, status };
};

export default useFetch;
