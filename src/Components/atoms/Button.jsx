import { motion } from "framer-motion";

/**
 * Botón reutilizable con variantes, tamaños y estado de carga.
 * Mantiene la identidad visual actual (azul/indigo, bordes redondeados) y el micro-feedback de motion.
 */
const VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  outline: "border border-green-400 bg-white text-green-600 hover:bg-green-50 shadow-sm",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.03 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold",
        "transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
