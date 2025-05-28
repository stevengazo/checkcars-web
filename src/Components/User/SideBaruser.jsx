import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";

const SideBarUser = ({ User, onClose }) => {

console.log("User data:", User);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Información del Usuario
        </h2>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          title="Cerrar"
          className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
        >
          <IoIosCloseCircle size={24} />
        </button>
      </div>

      {/* Detalles del usuario */}
      <div className="p-4 space-y-3 text-gray-700 text-sm">
        <p><span className="font-semibold">Email:</span> {User?.email || "—"}</p>
        
        {/* Espacio para futuras acciones */}
        <div className="pt-4 border-t mt-4">
          <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Editar Usuario
          </button>
          {/* Otro botón posible: Eliminar usuario, Cambiar contraseña, etc. */}
        </div>
      </div>
    </motion.div>
  );
};

export default SideBarUser;
