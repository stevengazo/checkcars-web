import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";

const ViewBookingSidebar = ({ isOpen, onClose, event, car }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 border-l border-gray-200 rounded-l-2xl overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Detalles del Evento
        </h2>

        <button
          onClick={onClose}
          title="Cerrar"
          className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
        >
          <IoIosCloseCircle size={24} />
        </button>
      </div>

      {/* Event Info */}
      {event ? (
        <div className="space-y-5 text-sm text-gray-800">
          <div>
            <span className="font-semibold text-gray-700">Título:</span>{" "}
            {event.title}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Inicio:</span>{" "}
            {event.start.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Fin:</span>{" "}
            {event.end.toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Motivo:</span>{" "}
            {event.reason}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Provincia:</span>{" "}
            {event.province}
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Vehicle Info */}
          <h3 className="text-lg font-semibold text-gray-900">
            Información del Vehículo
          </h3>

          {car ? (
            <div className="space-y-3">
              <Link
                to={`/car/${car.carId}`}
                className="inline-block w-full text-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
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
              {/* Agrega más campos si los necesitas */}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Cargando información del vehículo...
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay evento seleccionado.</p>
      )}
    </motion.div>
  );
};

export default ViewBookingSidebar;
