// Capa de servicios: cliente HTTP central.
// Centraliza baseURL, inyección de token, cabeceras, parseo de JSON (incl. body vacío),
// normalización de errores y manejo de 401 (sesión expirada).

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

/** Error de API con el status y el payload del backend. */
export class ApiError extends Error {
  constructor(status, message, data) {
    super(message || `Error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Limpia la sesión y redirige al login. Se dispara en respuestas 401. */
function handleUnauthorized() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Evita bucles si ya estamos en una ruta pública de auth.
  const path = window.location.pathname.toLowerCase();
  if (!["/", "/login", "/register", "/forgot"].includes(path)) {
    window.location.assign("/login");
  }
}

/**
 * Primitivo de bajo nivel: no serializa el body (lo recibe tal cual: string, FormData o undefined).
 * Centraliza baseURL, token, 401, parseo seguro y normalización de errores.
 * Lo usan tanto `request` (API nueva) como `useFetch` (compat con componentes no migrados).
 *
 * @param {string} path  Ruta relativa (ej. "/api/Cars") o URL absoluta.
 * @param {object} opts  { method, rawBody, headers, auth, isMultipart }
 * @returns {Promise<{data:any, status:number}>}
 */
async function rawRequest(path, { method = "GET", rawBody, headers = {}, auth = true, isMultipart = false } = {}) {
  const token = auth ? localStorage.getItem("token") : null;
  const url = /^https?:\/\//i.test(path) ? path : `${BASE_URL}${path}`;

  const finalHeaders = {
    // En multipart NO se fija Content-Type (lo pone el navegador con el boundary).
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let response;
  try {
    response = await fetch(url, { method, headers: finalHeaders, body: rawBody });
  } catch (networkErr) {
    throw new ApiError(0, "No se pudo conectar con el servidor.", { cause: networkErr.message });
  }

  if (response.status === 401) {
    handleUnauthorized();
    throw new ApiError(401, "Sesión expirada o no autorizada.");
  }

  // Parseo seguro: respuestas 201/204 suelen venir con body vacío.
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // respuesta no-JSON (ej. texto plano)
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.title || data.error)) ||
      `Error ${response.status}: ${response.statusText}`;
    throw new ApiError(response.status, message, data);
  }

  return { data, status: response.status };
}

/**
 * Realiza una petición HTTP contra la API serializando el body a JSON.
 * @param {string} path  Ruta relativa (ej. "/api/Cars").
 * @param {object} opts  { method, body, formData, headers, auth }
 * @returns {Promise<{data:any, status:number}>}
 */
function request(path, { method = "GET", body, formData, headers = {}, auth = true } = {}) {
  return rawRequest(path, {
    method,
    rawBody: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    headers,
    auth,
    isMultipart: Boolean(formData),
  });
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  upload: (path, formData, opts) => request(path, { ...opts, method: "POST", formData }),
};

export { BASE_URL, rawRequest, request };
export default http;
