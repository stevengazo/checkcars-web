import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../Hook/useFetch.js";
import { useContext, useState } from "react";
import SettingsContext from '../../Context/SettingsContext.jsx'


const ResetPassword = ({ email }) => {
  const { API_URL } = useContext(SettingsContext); 
  const _Nav = useNavigate();
  const { data, loading, error, status, refetch } = useFetch(
    `${API_URL}/api/Account/Reset`, // Ruta del backend
    {
      method: "POST",
      autoFetch: false,
    }
  );

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    refetch({
      body: JSON.stringify({
        email,
        token,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (status == 200) {
      _Nav("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 my-auto  rounded-lg shadow-lg">
      <h3 className="text-center text-2xl font-medium ">
        Cambio de Contraseña
      </h3>
      <div className="mt-4 text-center text-sm text-green-600">
        ¡Correo enviado! Revisa tu bandeja de entrada.
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700"
          >
            Token
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
      <Link
        to={"/login"}
        className="text-sm text-center text-blue-400  my-1 underline"
      >
        Login Page
      </Link>
      {error && (
        <p className="mt-4 text-red-500 text-sm">Error: {error.message}</p>
      )}
      {status === 200 && (
        <p className="mt-4 text-green-500 text-sm">
          Password reset successfully!
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
