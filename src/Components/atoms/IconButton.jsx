import { motion } from "framer-motion";

/** Botón circular para acciones con icono (cerrar, editar, etc.). */
const IconButton = ({ children, variant = "neutral", className = "", ...props }) => {
  const variants = {
    neutral: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-500",
        variants[variant] ?? variants.neutral,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default IconButton;
