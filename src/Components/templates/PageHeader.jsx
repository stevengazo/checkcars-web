import { motion } from "framer-motion";
import Heading from "../atoms/Heading";

/** Cabecera de página: título (animado) + acción opcional a la derecha. */
const PageHeader = ({ title, action, className = "" }) => (
  <div className={["mb-6 flex items-center justify-between gap-4", className].join(" ")}>
    <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
      <Heading level={1}>{title}</Heading>
    </motion.div>
    {action}
  </div>
);

export default PageHeader;
