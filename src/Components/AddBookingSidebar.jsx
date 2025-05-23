import { motion } from "framer-motion";

const AddBookingSidebar = ({ isOpen, onClose, newEvent, setNewEvent, onAddEvent }) => {
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
        Placa del vehículo:
        <input
          type="text"
          value={newEvent.plate}
          onChange={(e) => setNewEvent({ ...newEvent, plate: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
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
        <button onClick={onAddEvent} className="bg-blue-500 text-white px-4 py-2 rounded">
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
