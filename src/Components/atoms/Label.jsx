/** Etiqueta de formulario. */
const Label = ({ htmlFor, children, required = false, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={["block text-sm font-medium text-gray-700", className].join(" ")}
  >
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </label>
);

export default Label;
