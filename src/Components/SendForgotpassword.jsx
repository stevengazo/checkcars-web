import useFetch from "../Hook/useFetch"; // Usa tu hook personalizado
import { IoIosMail } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import SettingsContext from "../Context/SettingsContext";
import { motion } from "framer-motion";

const SendForgotPassword = ({ OnSendIt, selectedEmail }) => {
  const { API_URL } = useContext(SettingsContext);
  const [email, setEmail] = useState("");
  const { data, loading, error, status, refetch } = useFetch(
    `${API_URL}/api/account/forgot?email=${encodeURIComponent(email)}`, 
    {
      method: "POST",
      autoFetch: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  useEffect(() => {
    if (status === 200) {
      OnSendIt(true);
      selectedEmail(email);
    }
  }, [data]);

  return (
    <>
      <motion.div
        className="flex flex-1 flex-col justify-center px-6 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <IoIosMail size={56} className="mx-auto w-auto" />
          </motion.div>

          <motion.h2
            className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Recupera tu contraseña
          </motion.h2>

          <motion.p
            className="mt-2 text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Ingresa tu correo electrónico para recibir instrucciones.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </motion.button>
            </div>

            {error && (
              <motion.div
                className="mt-4 text-center text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {error}
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SendForgotPassword;
