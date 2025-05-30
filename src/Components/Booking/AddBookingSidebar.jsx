import { motion } from "framer-motion";
import { useState, useContext, useEffect } from "react";
import SettingsContext from "../../Context/SettingsContext";
import useFetch from "../../Hook/useFetch";

const AddBookingSidebar = ({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  onAddEvent,
}) => {
  const { API_URL } = useContext(SettingsContext);
  const [event, setEvent] = useState({
    bookingId: 0,
    startDate: event.start,
    endDate: event.end,
    reason: "",
    status: "Pendiente",
    userId: "string",
    province: "string",
    deleted: false,
    carId: "",
    confirmed: false,
    car: null,
  });


  const [isProcessing, setIsProcessing] = useState(false);
  // Fetch cars from the API
  const { data: cars } = useFetch(`${API_URL}/api/Cars`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // quiero enviar el evento al servidor y la actualizacion al calendario

  const SendToServer = async (event) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/api/Bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la cita");
      }

      const data = await response.json();
      console.log("Cita agregada:", data);
      setIsProcessing(false);
      onAddEvent();
    } catch (error) {
      console.error("Error al agregar la cita:", error);
      setIsProcessing(false);
    }
  }


  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-30 p-4"
    >
      <h2 className="text-lg font-bold mb-4">Agregar Cita</h2>
      <label className="block mb-2">
        Título:
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>
      <label className="block mb-2">
        Inicio:
        <input
          type="datetime-local"
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>
      <label className="block mb-2">
        Fin:
        <input
          type="datetime-local"
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>
      <label className="block mb-2">
        Vehículo:
        <select
          value={newEvent.carId}
          onChange={(e) => setNewEvent({ ...newEvent, carId: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        >
          {cars &&
            cars.map((car) => (
              <option key={car.carId} value={car.carId}>
                {car.plate} - {car.brand} {car.model}
              </option>
            ))}
        </select>
      </label>
      <label className="block mb-4">
        Motivo de uso:
        <textarea
          value={newEvent.reason}
          onChange={(e) => setNewEvent({ ...newEvent, reason: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </label>
      <div className="flex justify-between">
        <button
          onClick={onAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button onClick={onClose} className="text-gray-600 underline">
          Cancelar
        </button>
      </div>
    </motion.div>
  );
};

export default AddBookingSidebar;
