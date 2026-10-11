import { motion } from "framer-motion";

/** Panel con título para contener una gráfica de forma consistente. */
const ChartPanel = ({ title, subtitle, action, children, className = "", index = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.45 }}
    className={["rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md", className].join(" ")}
  >
    <div className="mb-2 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </motion.section>
);

export default ChartPanel;
