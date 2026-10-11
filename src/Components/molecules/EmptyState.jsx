import { FiInbox } from "react-icons/fi";

/** Estado vacío para listados sin resultados. */
const EmptyState = ({ title = "Sin resultados", description, icon, className = "" }) => (
  <div className={["flex flex-col items-center justify-center gap-2 py-10 text-center", className].join(" ")}>
    <div className="text-gray-300">{icon ?? <FiInbox size={40} />}</div>
    <p className="font-medium text-gray-600">{title}</p>
    {description && <p className="max-w-sm text-sm text-gray-400">{description}</p>}
  </div>
);

export default EmptyState;
