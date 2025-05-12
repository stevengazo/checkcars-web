import React, { useReducer, useContext } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import SettingsContext from '../Context/SettingsContext.jsx'
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reducer para manejar el estado del formulario de usuario.
 * 
 * @param {Object} state - Estado actual del formulario.
 * @param {Object} action - Acción que describe cómo modificar el estado.
 * @returns {Object} - Nuevo estado del formulario.
 * 
 * Ventajas de usar useReducer:
 * - Permite una mejor organización del estado cuando hay múltiples valores.
 * - Facilita la escalabilidad y mantenimiento del código.
 * - Reduce la repetición de código en comparación con múltiples useState.
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
  const {API_URL} = useContext(SettingsContext);
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
      transition={{ duration: 0.4, ease: "easeInOut" }}
   >
    <div className="absolute top-2 right-4 border border-gray-300 bg-white w-full max-w-sm p-4 rounded-lg shadow-lg">
      <IoIosCloseCircle
        size={40}
        color="red"
        className="hover:rotate-180 absolute top-1 right-1 transition duration-700"
        onClick={handleOnClose}
      />
      <h1 className="text-xl font-bold mb-4">Agregar Usuario</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={state.userName}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "userName", value: e.target.value })
          }
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
          }
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={state.phone}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "phone", value: e.target.value })
          }
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })
          }
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={state.confirmPassword}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "confirmPassword", value: e.target.value })
          }
          className="p-2 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg mt-4"
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