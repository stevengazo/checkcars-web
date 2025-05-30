import { motion } from "framer-motion";
import { useState, useContext } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: cars } = useFetch(`${API_URL}/api/Cars`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const SendToServer = async () => {
    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);

    // Validación: fecha inicio no puede ser después de la fecha final
    if (startDate > endDate) {
      setErrorMessage(
        "La fecha de inicio no puede ser posterior a la fecha de fin."
      );
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);

    try {
      const payload = {
        bookingId: 0,
        startDate: newEvent.start,
        endDate: newEvent.end,
        reason: newEvent.reason,
        status: "Pendiente",
        userId: "string", // Cambiar según tu lógica
        province: newEvent.province || "string", // Usar dato real si aplica
        deleted: false,
        carId: newEvent.carId,
        confirmed: false,
        car: null,
      };

      const response = await fetch(`${API_URL}/api/Bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la cita");
      }

      const data = await response.json();
      console.log("Cita agregada:", data);
      setIsProcessing(false);
      onAddEvent(data);
      onClose();
    } catch (error) {
      console.error("Error al agregar la cita:", error);
      setIsProcessing(false);
      setErrorMessage("Ocurrió un error al guardar la cita.");
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-30 p-6 overflow-y-auto border-l border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Agregar Cita
      </h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded-md border border-red-300">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Título</span>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Inicio</span>
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Fin</span>
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Vehículo</span>
          <select
            value={newEvent.carId}
            onChange={(e) =>
              setNewEvent({ ...newEvent, carId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione un vehículo</option>
            {cars &&
              cars.map((car) => (
                <option key={car.carId} value={car.carId}>
                  {car.plate} - {car.brand} {car.model}
                </option>
              ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Provincia</span>
          <select
            value={newEvent.province || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, province: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione una provincia</option>
            <option value="San José">San José</option>
            <option value="Cartago">Cartago</option>
            <option value="Alajuela">Alajuela</option>
            <option value="Heredia">Heredia</option>
            <option value="Guanacaste">Guanacaste</option>
            <option value="Puntarenas">Puntarenas</option>
            <option value="Limón">Limón</option>
            <option value="Otro">Otro</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Motivo de uso
          </span>
          <textarea
            value={newEvent.reason}
            onChange={(e) =>
              setNewEvent({ ...newEvent, reason: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancelar
        </button>
        <button
          onClick={SendToServer}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing}
        >
          {isProcessing ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </motion.div>
  );
};

export default AddBookingSidebar;
