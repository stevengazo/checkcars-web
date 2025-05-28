import React from "react";
import { motion } from "framer-motion";

import ReportGeneralByCar from "../Components/Chart/ReportGeneralByCar";
import ReportGeneralByUsers from "../Components/Chart/ReportGeneralByUsers";
import ReportByYear from "../Components/Chart/ReportByYear";
import ReportCarsByBrand from "../Components/Chart/ReportCarsByBrand";
import ReportCarByType from "../Components/Chart/ReportCarByType";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const Home = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">
        Bienvenido a la Aplicación
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[ReportGeneralByCar, ReportGeneralByUsers, ReportCarByType, ReportCarsByBrand].map(
          (Component, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl p-4
                shadow-lg
                hover:shadow-2xl
                transition-shadow
                duration-300"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <Component />
            </motion.div>
          )
        )}
      </div>

      <motion.div
        className="mt-6
          bg-white rounded-2xl p-4
          shadow-lg
          hover:shadow-2xl
          transition-shadow
          duration-300"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        <ReportByYear />
      </motion.div>
    </div>
  );
};

export default Home;
