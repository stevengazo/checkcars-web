import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import IconButton from "../atoms/IconButton";
import Heading from "../atoms/Heading";

/**
 * Panel modal centrado con overlay. Reemplaza los paneles flotantes ad-hoc
 * (add/edit) por un contenedor accesible y consistente.
 */
const Modal = ({ open, onClose, title, children, maxWidth = "max-w-xl" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={["w-full rounded-lg bg-white shadow-xl", maxWidth].join(" ")}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <Heading level={3}>{title}</Heading>
            <IconButton onClick={onClose} aria-label="Cerrar">
              <IoClose size={20} />
            </IconButton>
          </div>
          <div className="p-4">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
