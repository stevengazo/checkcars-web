import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

const UserAdd = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos del formulario
    console.log(":", {
      userName,
      email,
      phone,
      password,
      confirmPassword,
    });
  };

  const handleOnClose = () => {
    onClose(false);
  };

  return (
    <div className="absolute top-2 right-4 border border-gray-300 bg-white w-full max-w-sm p-4 rounded-lg shadow-lg">
      <IoIosCloseCircle
        size={40}
        color="red"
        className="hover:rotate-180 absolute top-1 right-1 transition duration-700"
        onClick={() => handleOnClose()}
      />
      <h1 className="text-xl font-bold mb-4">Agregar Usuario</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="tel"
          placeholder="Telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 rounded-lg border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg mt-4"
        >
          Agregar
        </button>
      </form>
    </div>
  );
};

export default UserAdd;
