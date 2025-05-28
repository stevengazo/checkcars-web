import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../Hook/useFetch";
import { IoIosCar } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import SettingsContext from "../Context/SettingsContext.jsx";

const Login = () => {
  const { API_URL } = useContext(SettingsContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, loading, error, refetch } = useFetch(
    `${API_URL}/api/account/login`,
    { method: "POST", autoFetch: false }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch({ body: JSON.stringify({ email, password }) });
  };

  if (data && data.token) {
    localStorage.setItem("user", JSON.stringify(data.user));  
    localStorage.setItem("token", data.token);
    nav("/Home");
  }

  return (
    <motion.div
      className="flex min-h-full h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-sm text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <IoIosCar size={56} className="mx-auto" />
        <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
      </motion.div>

      <motion.div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Correo
            </label>
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Contraseña
              </label>
              <div className="text-sm">
                <Link
                  to={"/forgot"}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Olvidó la contraseña?
                </Link>
              </div>
            </div>
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 text-center text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
