import { useState, useContext } from "react";
import SettingsContext from "../../Context/SettingsContext";

const RegisterUser = () => {
  const { API_URL } = useContext(SettingsContext);
  const URL = `${API_URL}/api/Account/Register`;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
          Accept: "*/*",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || data.succeeded === false) {
        const errorMsg =
          (data.errors && data.errors[0] && data.errors[0].description) ||
          "Error al registrar el usuario.";
        setError(errorMsg);
      } else {
        setSuccess(true);
        setForm({ email: "", password: "" });
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex items-center justify-centern ">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Registro de Usuario
        </h1>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">
            Usuario registrado correctamente.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
