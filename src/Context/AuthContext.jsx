import { createContext, useContext, useState, useCallback, useMemo } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

/** Lee el usuario persistido en localStorage de forma segura. */
function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readStoredUser());

  /** Inicia sesión: llama al servicio, persiste y actualiza el estado. */
  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (!result?.token) {
      throw new Error("Respuesta de login inválida: no se recibió token.");
    }
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(email));
    setToken(result.token);
    setUser(email);
    return result;
  }, []);

  /** Cierra sesión: limpia almacenamiento y estado. */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** Hook de acceso al contexto de autenticación. */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  }
  return ctx;
};

export default AuthContext;
