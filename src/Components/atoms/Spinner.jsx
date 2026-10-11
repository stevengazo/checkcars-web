import { DotLoader } from "react-spinners";

/** Indicador de carga centrado. Envuelve DotLoader para un uso consistente. */
const Spinner = ({ size = 48, color = "#2563EB", label, className = "" }) => (
  <div className={["flex flex-col items-center justify-center gap-3 py-6", className].join(" ")}>
    <DotLoader size={size} color={color} />
    {label && <span className="text-sm text-gray-500">{label}</span>}
  </div>
);

export default Spinner;
