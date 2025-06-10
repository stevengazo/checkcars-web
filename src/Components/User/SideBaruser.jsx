import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";
import SettingsContext from "../../Context/SettingsContext";

const SideBarUser = ({ User, onClose }) => {
  const { API_URL } = useContext(SettingsContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(null);
  const [match, setMatch] = useState(null);

  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    email: User?.email || "",
    phoneNumber: User?.phoneNumber || "",
    userName: User?.userName || "",
  });

  useEffect(() => {
    // Microsoft Identity default password rules
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    setPasswordValid(regex.test(password));
    setMatch(
      password !== "" && confirmPassword !== "" && password === confirmPassword
    );
  }, [password, confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm("¿Desea borrar el usuario?");
      if (!confirmDelete) return;

      const response = await fetch(`${API_URL}/api/Users/${User.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const HandleConfirmUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/Users/${User.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 204) {
        window.alert("Actualizado");
        onClose();
        setEditedUser({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const HandlePassword = async () => {
    try {
      if (!passwordValid || !match) return;

      const response = await fetch(`${API_URL}/api/Users/Password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: User.email,
          Password: password,
        }),
      });

      if (response.ok) {
        alert("Contraseña actualizada correctamente.");
        setPassword("");
        setConfirmPassword("");
        setIsPasswordEditing(false);
      } else {
        alert("Error al cambiar la contraseña.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = () => {
    console.log("Saving user:", editedUser);
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
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Información del Usuario
        </h2>
        <button
          onClick={onClose}
          className="flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-800 hover:rotate-180 transition duration-200"
        >
          <IoIosCloseCircle size={24} />
        </button>
      </div>

      <div className="p-4 space-y-3 text-gray-700 text-sm">
        <p>
          <span className="font-semibold">Email:</span> {User?.email || "—"}
        </p>
        <p>
          <span className="font-semibold">Teléfono:</span>{" "}
          {User?.phoneNumber || "—"}
        </p>
        <p>
          <span className="font-semibold">Usuario:</span>{" "}
          {User?.userName || "—"}
        </p>

        {isPasswordEditing && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border space-y-3">
            <h5 className="text-base font-semibold text-gray-800">
              Cambio de Contraseña
            </h5>

            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-600">Nueva Contraseña</label>
              <input
                type="password"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm text-gray-600">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {password && (
              <div className="text-sm">
                <p
                  className={passwordValid ? "text-green-600" : "text-red-600"}
                >
                  {passwordValid
                    ? "✓ Contraseña válida"
                    : "✗ Debe tener mayúsculas, minúsculas, número, símbolo y al menos 8 caracteres"}
                </p>
                <p className={match ? "text-green-600" : "text-red-600"}>
                  {match
                    ? "✓ Las contraseñas coinciden"
                    : "✗ Las contraseñas no coinciden"}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={HandlePassword}
                disabled={!passwordValid || !match}
                className={`px-4 py-2 rounded-md text-white transition ${
                  passwordValid && match
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Cambiar Contraseña
              </button>
              <button
                onClick={() => setIsPasswordEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="pt-4 border-t mt-4 space-y-2">
            <button
              onClick={() => setIsPasswordEditing(true)}
              className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Cambiar Contraseña
            </button>
            <button
              onClick={() => HandleConfirmUser(User?.emailConfirmed)}
              className={`w-full py-2 px-4 rounded text-white transition ${
                User?.emailConfirmed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {User?.emailConfirmed ? "Desactivar Usuario" : "Activar Usuario"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Eliminar Usuario
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SideBarUser;
