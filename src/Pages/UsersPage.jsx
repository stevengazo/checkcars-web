import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserAdd from "../Components/UserAdd";
import UsersTable from "../Components/UsersTable";

const UsersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 seg de carga
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-800">Usuarios del Sistema</h2>
        <p className="text-sm italic text-gray-500">
          Los registros no requieren usuarios, solamente la visualización en el sistema.
        </p>
      </header>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-shadow shadow-md hover:shadow-lg"
        >
          Agregar Usuario
        </button>
      </div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, yoyo: Infinity }}
        >
          <motion.div
            className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </motion.div>
      ) : (
        <UsersTable />
      )}

      {showModal && <UserAdd onClose={setShowModal} />}
    </div>
  );
};

export default UsersPage;
