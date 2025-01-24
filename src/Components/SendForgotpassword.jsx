import useFetch from "../Hook/useFetch"; // Usa tu hook personalizado
import { IoIosMail } from "react-icons/io";
import React, { useEffect, useState } from "react";

const SendForgotPassword = ({ OnSendIt, selectedEmail }) => {
  const [email, setEmail] = useState("");
  const { data, loading, error, status, refetch } = useFetch(
    ` https://mecsacars.stevengazo.co.cr/api/account/forgot?email=${encodeURIComponent(
      email
    )}`, // Ruta del backend
    {
      method: "POST",
      autoFetch: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  useEffect(() => {
    if (status == 200) {
      OnSendIt(true);
      selectedEmail(email);
    }
  }, [data]);

  return (
    <>
      <div className="flex  flex-1 flex-col justify-center px-6 py-12 p8- ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <IoIosMail size={56} color="" className="mx-auto w-auto" />
          <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Recupera tu contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico para recibir instrucciones.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-center text-sm text-red-600">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default SendForgotPassword;
