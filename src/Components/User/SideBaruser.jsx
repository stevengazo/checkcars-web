import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";

const SideBarUser = ({ User, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    email: User?.email || "",
    phoneNumber: User?.phoneNumber || "",
    userName: User?.userName || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving user:", editedUser);
    // Aquí iría la lógica para guardar los datos editados
    setIsEditing(false);
  };

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

      {/* Contenido */}
      <div className="p-4 space-y-3 text-gray-700 text-sm">
        {isEditing ? (
          <form className="space-y-3">
            <div>
              <label className="block font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1"
              />
            </div>
            <div>
              <label className="block font-semibold">Teléfono:</label>
              <input
                type="text"
                name="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1"
              />
            </div>
            <div>
              <label className="block font-semibold">Nombre de usuario:</label>
              <input
                type="text"
                name="userName"
                value={editedUser.userName}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-1"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
          </form>
        ) : (
          <>
            <p>
              <span className="font-semibold">Email:</span> {User?.email || "—"}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {User?.phoneNumber || "—"}
            </p>
            <p>
              <span className="font-semibold">Usuario:</span> {User?.userName || "—"}
            </p>
          </>
        )}

        {/* Acciones */}
        {!isEditing && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Editar Usuario
            </button>
            <button className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              Cambiar Contraseña
            </button>
            <button
              className={`w-full py-2 px-4 rounded text-white transition ${
                User?.emailConfirmed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {User?.emailConfirmed ? "Desactivar Usuario" : "Activar Usuario"}
            </button>
            <button className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Eliminar Usuario
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SideBarUser;
