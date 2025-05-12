import { AnimatePresence, motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";
import { useState } from "react";

const SERVICE_TYPES = [
    "Alineación",
    "Balanceo de neumáticos",
    "Cambio de batería",
    "Cambio de bujías",
    "Cambio de filtro de aire",
    "Cambio de filtro de cabina",
    "Cambio de líquido de frenos",
    "Cambio de líquido de transmisión",
    "Cambio de neumáticos",
    "Cambio de aceite",
    "Diagnóstico electrónico",
    "Instalación de accesorios",
    "Inspección de frenos",
    "Inspección del motor",
    "Lavado y detallado",
    "Otro",
    "Revisión de luces",
    "Revisión del sistema de escape",
    "Revisión del sistema eléctrico",
    "Revisión de suspensión",
    "Revisión general",
    "Rotación de neumáticos",
    "Servicio de dirección",
    "Servicio de transmisión"
  ];
  

const AddService = ({ carId }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 16),
    type: "",
    description: "",
    carId: carId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Servicio enviado:", formData);
    // Aquí deberías hacer el POST al backend
  };

  const handleClose = () => {
    // Lógica para ocultar la barra lateral si no usas un estado externo
    document.getElementById("add-service-sidebar")?.classList.add("hidden");
  };

  return (
    <AnimatePresence>
      <motion.div
        id="add-service-sidebar"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 z-50 w-full md:w-[50vw] lg:w-[40vw] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800">Nuevo Servicio</h2>
          <button
            onClick={handleClose}
            className="text-red-600 hover:text-red-800 transition-transform transform hover:rotate-180"
            title="Cerrar"
          >
            <IoIosCloseCircle size={32} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título del servicio"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona el tipo de servicio</option>
            {SERVICE_TYPES.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del servicio"
            className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />

          <input
            type="hidden"
            name="carId"
            value={formData.carId}
            readOnly
          />

          <button
            type="submit"
            className="w-full py-3 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Guardar Servicio
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddService;
