import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EntrySearch from "../Module/EntrySearch";
import AddExit from "../Components/AddExit";

const Exits = () => {
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
          Reporte de Salidas
        </motion.h1>

        <motion.button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Nueva Salida
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <EntrySearch />
      </motion.div>

   
        {showAdd && (
            <AddExit OnHandleClose={setShowAdd} />
        )}

    </motion.div>
  );
};

export default Exits;
