import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:8080/notificationhub") // Cambia la URL según tu API
  .withAutomaticReconnect()
  .build();

export const startConnection = async () => {
  try {
    await hubConnection.start();
    console.log("Conectado a SignalR");
  } catch (err) {
    console.error("Error al conectar con SignalR:", err);
  }
};

export const onNotificationReceived = (callback) => {
  hubConnection.on("ReceiveNotification", callback);
};
