import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import IconButton from "../atoms/IconButton";

/**
 * Panel deslizante (off-canvas) desde la derecha, con backdrop, cabecera y pie opcionales.
 * Reemplaza los paneles ad-hoc de los sidebars por un contenedor consistente.
 */
const OffCanvas = ({ open, onClose, title, subtitle, children, footer, width = "max-w-md" }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-40 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.aside
          className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl ${width}`}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          role="dialog"
          aria-modal="true"
        >
          <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
            <IconButton onClick={onClose} aria-label="Cerrar">
              <IoClose size={20} />
            </IconButton>
          </header>

          <div className="flex-1 overflow-y-auto p-5">{children}</div>

          {footer && <div className="border-t border-gray-100 bg-gray-50 p-4">{footer}</div>}
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

export default OffCanvas;
