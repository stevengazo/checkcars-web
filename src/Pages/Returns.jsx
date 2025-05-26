import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReturnsSearch from "../Module/ReturnsSearch.jsx";

const Returns = () => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-3xl font-medium"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Reporte de Entrega Vehiculos
        </motion.h1>

     
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ReturnsSearch />
      </motion.div>

   
        {showAdd && (
            <AddExit OnHandleClose={setShowAdd} />
        )}

    </motion.div>
  );
};

export default Returns;
