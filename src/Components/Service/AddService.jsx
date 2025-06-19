// Imports
import { AnimatePresence, motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";
import { useState, useContext } from "react";
import SettingsContext from "../../Context/SettingsContext.jsx";
import useFetch from "../../Hook/useFetch.js";

// Tipos de servicio
const SERVICE_TYPES = [
  "Alineación", "Balanceo de neumáticos", "Cambio de batería", "Cambio de bujías",
  "Cambio de filtro de aire", "Cambio de filtro de cabina", "Cambio de líquido de frenos",
  "Cambio de líquido de transmisión", "Cambio de neumáticos", "Cambio de aceite",
  "Diagnóstico electrónico", "Instalación de accesorios", "Inspección de frenos",
  "Inspección del motor", "Lavado y detallado", "Otro", "Revisión de luces",
  "Revisión del sistema de escape", "Revisión del sistema eléctrico", "Revisión de suspensión",
  "Revisión general", "Rotación de neumáticos", "Servicio de dirección", "Servicio de transmisión"
];

const AddService = ({ carId, OnCloseForm, OnAdded }) => {
  const { API_URL } = useContext(SettingsContext);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    description: "",
    carId: carId,
    mileage: 0,
    nextMileage: 0,
  });

  const [success, setSuccess] = useState(false);

  const {
    data: result,
    loading: sending,
    error: sendingError,
    refetch: sendService,
  } = useFetch(`${API_URL}/api/CarServices`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
    autoFetch: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mileage" || name === "nextMileage" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await sendService();
      setSuccess(true);
      OnAdded();
      setFormData({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        type: "",
        description: "",
        carId: carId,
        mileage: 0,
        nextMileage: 0,
      });
      setTimeout(() => {
        setSuccess(false);
        OnCloseForm(false);
      }, 900);
    } catch (err) {
      console.error("Error al enviar servicio:", err);
    }
  };

  const handleClose = () => {
    OnCloseForm(false);
  };

  return (
    <AnimatePresence>
      <motion.div
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
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">Selecciona el tipo de servicio</option>
            {SERVICE_TYPES.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del servicio"
            className="w-full p-3 border-2 border-gray-300 rounded-lg resize-none"
            rows={4}
            required
          />

          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Kilometraje actual"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            min={0}
            required
          />

          <input
            type="number"
            name="nextMileage"
            value={formData.nextMileage}
            onChange={handleChange}
            placeholder="Próximo kilometraje recomendado"
            className="w-full p-3 border-2 border-gray-300 rounded-lg"
            min={0}
            required
          />

          <input type="hidden" name="carId" value={formData.carId} readOnly />

          <button
            type="submit"
            className="w-full py-3 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={sending}
          >
            {sending ? "Guardando..." : "Guardar Servicio"}
          </button>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-green-600 bg-green-100 border border-green-400 p-3 rounded-lg text-center"
              >
                ¡Servicio añadido exitosamente!
              </motion.div>
            )}
          </AnimatePresence>

          {sendingError && (
            <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-lg text-center">
              Error al guardar el servicio. Intenta nuevamente.
            </div>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddService;
