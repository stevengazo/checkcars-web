import { useState, useEffect, useCallback } from 'react';

const useFetch = (url, options = {}) => {
  const {
    autoFetch = true,
    dependencies = [], // nuevas dependencias opcionales para controlar re-fetch
    ...fetchOptions
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(0);

  const token = localStorage.getItem('token');

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          ...customOptions,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...fetchOptions.headers,
            ...(customOptions.headers || {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        setStatus(response.status);
        setData(result);
      } catch (err) {
        setData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url, token, JSON.stringify(fetchOptions)] // para que detecte cambios en opciones, se stringify aquí
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, ...dependencies]); // se vuelve a llamar cuando cambian las dependencias

  return { data, loading, error, refetch: fetchData, status };
};

export default useFetch;
