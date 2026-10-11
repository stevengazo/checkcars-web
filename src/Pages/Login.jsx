import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import AuthLayout from "../Components/templates/AuthLayout";
import FormField from "../Components/molecules/FormField";
import Button from "../Components/atoms/Button";

const Login = () => {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Sesión iniciada correctamente.");
      nav("/home");
    } catch (err) {
      toast.error(err?.message || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Inicia sesión en tu cuenta">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="email"
          label="Correo"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="block text-sm font-medium text-gray-700">Contraseña</span>
            <Link to="/forgot" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
              ¿Olvidó la contraseña?
            </Link>
          </div>
          <FormField
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Iniciar sesión
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Link to="/register" className="text-sm font-light text-blue-600 hover:text-blue-500">
            Registrarme
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Login;
