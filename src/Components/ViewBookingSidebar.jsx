import { motion } from "framer-motion";
import { Link } from "react-router-dom";


const ViewBookingSidebar = ({ isOpen, onClose, event, car }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-20 p-6 border-l rounded-l-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Detalles del Evento
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-600 border rounded-4xl p-4 hover:rotate-180 transition duration-500  bg-red-600"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {event ? (
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Título:</span> {event.title}
          </div>
          <div>
            <span className="font-medium">Inicio:</span>{" "}
            {event.start.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Fin:</span>{" "}
            {event.end.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Motivo:</span> {event.reason}
          </div>
          <div>
            <span className="font-medium">Provincia:</span> {event.province}
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold text-gray-800">
            Información del Vehículo
          </h3>
          {car ? (
            <div className="space-y-2">
              <Link
                to={`/car/${car.carId}`}
                className="flex items-center justify-center px-4 py-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-700 transition duration-200"
              >
                Vehículo
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
              {/* Puedes agregar más campos si existen en tu API */}
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
