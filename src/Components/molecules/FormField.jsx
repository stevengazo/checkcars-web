import Input from "../atoms/Input";
import Label from "../atoms/Label";

/**
 * Campo de formulario: etiqueta + input + mensaje de error.
 * Reemplaza el patrón label+input+className repetido en los formularios.
 */
const FormField = ({ id, label, error, required = false, className = "", ...inputProps }) => (
  <div className={className}>
    {label && (
      <Label htmlFor={id} required={required} className="mb-1">
        {label}
      </Label>
    )}
    <Input id={id} name={inputProps.name ?? id} invalid={Boolean(error)} {...inputProps} />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default FormField;
