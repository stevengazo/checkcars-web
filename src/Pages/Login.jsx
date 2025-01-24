import React, { useState } from 'react';
import useFetch from '../Hook/useFetch'; // Importa el hook personalizado
import { IoIosCar } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const nav  = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Opciones del hook
  const { data, loading, error, refetch } = useFetch(
    'https://mecsacars.stevengazo.co.cr/api/account/login',
    {
      method: 'POST',
      autoFetch: false, // Evita que la petición se haga automáticamente
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const bodyD = JSON.stringify({ email, password });


    refetch({
      body:bodyD, // Enviar las credenciales
    });

  };

  // Si hay un token exitoso, guardarlo en localStorage
  if (data && data.token) {
    localStorage.setItem('token', data.token);
    nav('/Home');
    //alert('Inicio de sesión exitoso');
   
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
         <IoIosCar size={56} color=''  className="mx-auto w-auto" />

          <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Contraseña
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Olvidó la contraseña?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
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

export default Login;
