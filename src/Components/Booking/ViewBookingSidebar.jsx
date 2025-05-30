import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { useContext, useState } from "react";
import SettingsContext from "../../Context/SettingsContext";
import useFetch from "../../Hook/useFetch";

const ViewBookingSidebar = ({ isOpen, onClose, event, car }) => {
  const { API_URL } = useContext(SettingsContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!event?.bookingId) return;
    try {
      setIsProcessing(true);
      const response = await fetch(
        `${API_URL}/api/Bookings/confirm/${event.bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      console.log("Evento confirmado:", result);
      alert("Evento confirmado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al confirmar el evento:", error);
      alert("Ocurrió un error al confirmar el evento");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!event?.bookingId) return;
    try {
      setIsProcessing(true);
      const response = await fetch(
        `${API_URL}/api/Bookings/cancel/${event.bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      console.log("Evento cancelado:", result);
      alert("Evento cancelado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al cancelar el evento:", error);
      alert("Ocurrió un error al cancelar el evento");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 border-l border-gray-200 rounded-l-2xl overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Detalles del Evento
        </h2>
        <button
          onClick={onClose}
          title="Cerrar"
          className="p-2 text-red-500 rounded-full hover:bg-red-100 hover:rotate-180 transition-transform"
        >
          <IoIosCloseCircle size={28} />
        </button>
      </div>

      {event ? (
        <div className="space-y-6 text-sm text-gray-800">
          <div className="grid gap-2">
            <div>
              <span className="font-medium text-gray-700">Título:</span>{" "}
              {event.title}
            </div>
            <div>
              <span className="font-medium text-gray-700">Inicio:</span>{" "}
              {event.start.toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Fin:</span>{" "}
              {event.end.toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Motivo:</span>{" "}
              {event.reason}
            </div>
            <div>
              <span className="font-medium text-gray-700">Provincia:</span>{" "}
              {event.province}
            </div>
            <div>
              <span className="font-medium text-gray-700">Estado:</span>{" "}
              {event.status}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              disabled={isProcessing}
              onClick={handleConfirm}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
            <button
              disabled={isProcessing}
              onClick={handleCancel}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>

          <hr className="border-gray-300" />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Vehículo
            </h3>

            {car ? (
              <div className="space-y-3">
                <Link
                  to={`/car/${car.carId}`}
                  className="block text-center w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Ver Detalles del Vehículo
                </Link>
                <div>
                  <span className="font-medium">Placa:</span> {car.plate}
                </div>
                <div>
                  <span className="font-medium">Marca:</span> {car.brand}
                </div>
                <div>
                  <span className="font-medium">Modelo:</span> {car.model}
                </div>
                <div>
                  <span className="font-medium">Año:</span> {car.year}
                </div>
                <div>
                  <span className="font-medium">Color:</span> {car.color}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Cargando información del vehículo...
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay evento seleccionado.</p>
      )}
    </motion.div>
  );
};

export default ViewBookingSidebar;
