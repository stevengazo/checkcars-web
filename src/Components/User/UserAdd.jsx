import { useReducer, useState } from "react";
import { toast } from "react-toastify";
import usersService from "../../services/usersService";
import Modal from "../molecules/Modal";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";

const initialState = { userName: "", email: "", password: "", confirmPassword: "" };

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

const UserAdd = ({ onClose, onAdded }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => dispatch({ type: "SET_FIELD", field, value: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (state.password !== state.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await usersService.create({ userName: state.userName, email: state.email, password: state.password });
      toast.success("Usuario agregado correctamente.");
      dispatch({ type: "RESET" });
      onAdded?.();
      onClose?.(false);
    } catch (err) {
      const msg = err?.message || "No se pudo agregar el usuario.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={() => onClose?.(false)} title="Agregar Usuario" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="userName" label="Nombre de usuario" value={state.userName} onChange={set("userName")} required placeholder="Nombre" />
        <FormField id="email" label="Correo" type="email" value={state.email} onChange={set("email")} required placeholder="correo@ejemplo.com" />
        <FormField id="password" label="Contraseña" type="password" value={state.password} onChange={set("password")} required />
        <FormField id="confirmPassword" label="Confirmar contraseña" type="password" value={state.confirmPassword} onChange={set("confirmPassword")} required error={error || undefined} />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onClose?.(false)} disabled={loading}>Cancelar</Button>
          <Button type="submit" loading={loading}>Agregar</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserAdd;
