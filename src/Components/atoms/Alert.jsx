import { motion } from "framer-motion";

/** Mensaje inline de estado (error/éxito/info). */
const TONES = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

const Alert = ({ children, tone = "info", className = "" }) => {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        "rounded-md border px-3 py-2 text-sm",
        TONES[tone] ?? TONES.info,
        className,
      ].join(" ")}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </motion.div>
  );
};

export default Alert;
