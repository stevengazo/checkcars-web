import { motion } from "framer-motion";
import CrashSearch from "../Module/CrashSearch";

const Crashes = () => {
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-medium"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Reporte de Choques
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CrashSearch />
      </motion.div>
    </motion.div>
  );
};

export default Crashes;
