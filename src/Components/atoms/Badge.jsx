/** Etiqueta de estado con tonos semánticos. */
const TONES = {
  gray: "bg-gray-100 text-gray-700 ring-gray-300",
  green: "bg-green-50 text-green-700 ring-green-300",
  blue: "bg-blue-50 text-blue-700 ring-blue-300",
  purple: "bg-purple-50 text-purple-700 ring-purple-300",
  red: "bg-red-50 text-red-700 ring-red-300",
  amber: "bg-amber-50 text-amber-700 ring-amber-300",
};

const Badge = ({ children, tone = "gray", className = "" }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      TONES[tone] ?? TONES.gray,
      className,
    ].join(" ")}
  >
    {children}
  </span>
);

export default Badge;
