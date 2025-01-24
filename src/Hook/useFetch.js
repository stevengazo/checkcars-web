import { useState, useEffect, useCallback } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(0);

  const token = localStorage.getItem('token'); // Obtén el token almacenado

  const fetchData = useCallback(
    async (customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          ...customOptions, // Mezclar opciones iniciales y personalizadas
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token a los headers
            ...options.headers, // Headers iniciales
            ...(customOptions.headers || {}), // Headers personalizados
          },
        });
        console.warn(response)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        setStatus(response.status)
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url, options, token]
  );

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData , status };
};

export default useFetch;
