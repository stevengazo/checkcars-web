import RegisterUser from "../Components/User/RegisterUser";
import {motion,AnimatePresence } from "framer-motion";
import {IoIosCar} from "react-icons/io";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <motion.div
      className="flex  flex-1 flex-col justify-center px-6 py-12 lg:px-8"
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
        <RegisterUser />
                 <Link
            to={"/login"}
            className="font-light text-sm align-middle justify-center text-center  text-indigo-600 hover:text-indigo-500"
          >
             ¿Ya Tienes cuenta? Inicia sesión...
          </Link>

      </motion.div>
    </motion.div>
  );
};
export default Register;
// import React, { useState } from "react";
