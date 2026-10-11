import { motion } from "framer-motion";

/** Tonos semánticos para el icono/acento de la tarjeta. */
const TONES = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  green: "bg-green-50 text-green-600 ring-green-100",
  purple: "bg-purple-50 text-purple-600 ring-purple-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  red: "bg-red-50 text-red-600 ring-red-100",
  gray: "bg-gray-100 text-gray-600 ring-gray-200",
};

/**
 * Tarjeta de métrica (KPI): icono + valor + etiqueta, con estado de carga.
 */
const StatCard = ({ label, value, icon, tone = "blue", hint, loading = false, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4 }}
    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ring-1 ${TONES[tone] ?? TONES.blue}`}>
      {icon}
    </div>
    <div className="min-w-0">
      {loading ? (
        <div className="h-7 w-14 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className="text-2xl font-bold leading-tight text-gray-800">{value}</p>
      )}
      <p className="truncate text-sm text-gray-500">{label}</p>
      {hint && !loading && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
    </div>
  </motion.div>
);

export default StatCard;
