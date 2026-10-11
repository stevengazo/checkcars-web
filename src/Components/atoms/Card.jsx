/** Contenedor con superficie, borde y sombra consistentes. */
const Card = ({ children, className = "", padding = "p-4" }) => (
  <div
    className={[
      "rounded-xl border border-gray-200 bg-white shadow-sm",
      padding,
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

export default Card;
