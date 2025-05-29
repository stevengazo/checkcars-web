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
      const response = await fetch(`${API_URL}/api/Bookings/confirm/${event.bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
      const response = await fetch(`${API_URL}/api/Bookings/cancel/${event.bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
        <h2 className="text-2xl font-bold text-gray-900">Detalles del Evento</h2>
        <button
          onClick={onClose}
          title="Cerrar"
          className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
        >
          <IoIosCloseCircle size={24} />
        </button>
      </div>

      {event ? (
        <div className="space-y-5 text-sm text-gray-800">
          <div><span className="font-semibold text-gray-700">Título:</span> {event.title}</div>
          <div><span className="font-semibold text-gray-700">Inicio:</span> {event.start.toLocaleString()}</div>
          <div><span className="font-semibold text-gray-700">Fin:</span> {event.end.toLocaleString()}</div>
          <div><span className="font-semibold text-gray-700">Motivo:</span> {event.reason}</div>
          <div><span className="font-semibold text-gray-700">Provincia:</span> {event.province}</div>
          <div><span className="font-semibold text-gray-700">Estado:</span> {event.status}</div>

          <div className="flex justify-between items-center gap-4">
            <button
              disabled={isProcessing}
              onClick={handleConfirm}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
            >
              Confirmar Evento
            </button>
            <button
              disabled={isProcessing}
              onClick={handleCancel}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
            >
              Cancelar Evento
            </button>
          </div>

          <hr className="my-4 border-gray-300" />

          <h3 className="text-lg font-semibold text-gray-900">Información del Vehículo</h3>
          {car ? (
            <div className="space-y-3">
              <Link
                to={`/car/${car.carId}`}
                className="inline-block w-full text-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Ver Detalles del Vehículo
              </Link>
              <div><span className="font-medium">Placa:</span> {car.plate}</div>
              <div><span className="font-medium">Marca:</span> {car.brand}</div>
              <div><span className="font-medium">Modelo:</span> {car.model}</div>
              <div><span className="font-medium">Año:</span> {car.year}</div>
              <div><span className="font-medium">Color:</span> {car.color}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Cargando información del vehículo...</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay evento seleccionado.</p>
      )}
    </motion.div>
  );
};

export default ViewBookingSidebar;
