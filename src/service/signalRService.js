import * as signalR from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL ?? "";

let connection = null;

/**
 * Crea (si no existe) la conexión al hub de notificaciones.
 * El JWT se envía como query string `access_token`, que es como SignalR
 * autentica los WebSockets (no admiten cabecera Authorization).
 */
function getConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/notificationhub`, {
      accessTokenFactory: () => localStorage.getItem("token") ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return connection;
}

/** Inicia la conexión si hay token y aún no está conectada. */
export async function startConnection() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const conn = getConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    try {
      await conn.start();
    } catch (err) {
      console.error("Error al conectar con SignalR:", err);
    }
  }
  return conn;
}

/** Detiene y descarta la conexión (p. ej. al cerrar sesión). */
export async function stopConnection() {
  if (!connection) return;
  try {
    await connection.stop();
  } catch {
    /* noop */
  }
  connection = null;
}

/** Suscribe un callback al evento de notificación. Devuelve la función para desuscribir. */
export function onNotificationReceived(callback) {
  const conn = getConnection();
  conn.on("ReceiveNotification", callback);
  return () => conn.off("ReceiveNotification", callback);
}

export default { startConnection, stopConnection, onNotificationReceived };
