import { motion } from "framer-motion";

const ViewBookingSidebar = ({ isOpen, onClose, event }) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-20 p-6 border-l rounded-l-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Detalles del Evento</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
          ✕
        </button>
      </div>

      {event ? (
        <div className="space-y-4 text-sm text-gray-700">
          <div><span className="font-medium">Título:</span> {event.title}</div>
          <div><span className="font-medium">Inicio:</span> {event.start.toLocaleString()}</div>
          <div><span className="font-medium">Fin:</span> {event.end.toLocaleString()}</div>
          <div><span className="font-medium">Placa:</span> {event.plate}</div>
          <div><span className="font-medium">Motivo:</span> {event.reason}</div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay evento seleccionado.</p>
      )}
    </motion.div>
  );
};

export default ViewBookingSidebar;
