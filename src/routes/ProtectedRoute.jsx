import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/** Protege rutas privadas: redirige a /login si no hay sesión. */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
