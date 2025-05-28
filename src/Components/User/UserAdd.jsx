import React, { useReducer, useContext, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import SettingsContext from "../../Context/SettingsContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reducer para manejar el estado del formulario de usuario.
 */
const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const UserAdd = ({ onClose }) => {
  const { API_URL } = useContext(SettingsContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (state.password !== state.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userName: state.userName,
          email: state.email,
          password: state.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el usuario.");
      }

      const result = await response.json();
      setMessage("✅ Usuario agregado correctamente.");
      dispatch({ type: "RESET" });
    } catch (err) {
      setError(err.message || "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    onClose(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        className="fixed top-0 right-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="relative bg-white w-full max-w-sm p-6 rounded-lg shadow-lg transform transition-all">
          <IoIosCloseCircle
            size={40}
            color="red"
            className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleOnClose}
          />
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Agregar Usuario
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={state.userName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "userName",
                  value: e.target.value,
                })
              }
              required
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                })
              }
              required
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={state.password}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "password",
                  value: e.target.value,
                })
              }
              required
              className="p-3 rounded-lg border border-gray-300"
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={state.confirmPassword}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "confirmPassword",
                  value: e.target.value,
                })
              }
              required
              className="p-3 rounded-lg border border-gray-300"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Agregando..." : "Agregar"}
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserAdd;
