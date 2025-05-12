import { useState, useCallback } from 'react';

/**
 * Hook personalizado para enviar datos como multipart/form-data.
 * 
 * Características:
 * - Soporta autenticación con token (desde localStorage).
 * - Manejador de estado: loading, error, data, status.
 * - Compatible con FormData.
 * - Permite reintentos con `refetch`.
 */
const useMultipartFetch = (url, initialOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(0);

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async (formData, customOptions = {}) => {
    if (!(formData instanceof FormData)) {
      console.error("useMultipartFetch espera un FormData como primer argumento.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(0);

    try {
      const response = await fetch(url, {
        method: 'POST',
        ...initialOptions,
        ...customOptions,
        headers: {
          Authorization: `Bearer ${token}`,
          ...initialOptions.headers,
          ...(customOptions.headers || {}),
          // NO incluir 'Content-Type', el navegador lo agregará automáticamente
        },
        body: formData,
      });

      setStatus(response.status);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.status}`);
      }

      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, token, initialOptions]);

  return { data, loading, error, refetch: fetchData, status };
};

export default useMultipartFetch;
