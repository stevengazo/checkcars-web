import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarTable from "../Components/Car/CarTable";
import CarAdd from "../Components/Car/CarAdd";

const CarList = () => {
  const [addCar, setAddCar] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-3xl font-medium"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Vehículos
        </motion.h1>

        {!addCar && (
          <motion.button
            className="border border-green-400 shadow text-green-400 bg-white px-4 py-2 rounded-md hover:bg-green-50 transition"
            onClick={() => setAddCar(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agregar Auto
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {addCar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CarAdd OnClose={setAddCar} Added={setAdded} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <CarTable />
      </motion.div>
    </motion.div>
  );
};

export default CarList;
