/** Título de sección/página con tamaños consistentes. */
const SIZES = {
  1: "text-3xl font-semibold",
  2: "text-2xl font-semibold",
  3: "text-xl font-semibold",
  4: "text-lg font-medium",
};

const Heading = ({ level = 1, children, className = "" }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={["tracking-tight text-gray-800", SIZES[level] ?? SIZES[1], className].join(" ")}>
      {children}
    </Tag>
  );
};

export default Heading;
