import React, { useReducer, useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import SettingsContext from "../Context/SettingsContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reducer para manejar el estado del formulario de usuario.
 */
const initialState = {
  userName: "",
  email: "",
  phone: "",
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { API_URL } = useContext(SettingsContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del usuario:", state);
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
                dispatch({ type: "SET_FIELD", field: "userName", value: e.target.value })
              }
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="email"
              placeholder="Email"
              value={state.email}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
              }
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={state.phone}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "phone", value: e.target.value })
              }
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })
              }
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={state.confirmPassword}
              onChange={(e) =>
                dispatch({ type: "SET_FIELD", field: "confirmPassword", value: e.target.value })
              }
              className="p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Agregar
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserAdd;
