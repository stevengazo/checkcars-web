import { forwardRef } from "react";

/** Campo de entrada base. Unifica el estilo de inputs repetido por toda la app. */
const Input = forwardRef(({ className = "", invalid = false, ...props }, ref) => (
  <input
    ref={ref}
    className={[
      "block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 sm:text-sm",
      "border outline-none transition focus:ring-2",
      invalid
        ? "border-red-400 focus:border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
      className,
    ].join(" ")}
    {...props}
  />
));

Input.displayName = "Input";
export default Input;
