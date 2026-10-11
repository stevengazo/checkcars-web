import { motion } from "framer-motion";
import { IoIosCar } from "react-icons/io";

/** Layout centrado para pantallas de autenticación (login, registro, recuperación). */
const AuthLayout = ({ title, subtitle, children }) => (
  <motion.div
    className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <motion.div
      className="text-center sm:mx-auto sm:w-full sm:max-w-sm"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <IoIosCar size={56} className="mx-auto text-blue-600" />
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </motion.div>

    <motion.div
      className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default AuthLayout;
