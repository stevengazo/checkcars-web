import React, { useState } from "react";
import { FaHome, FaCar, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-blue-600 text-white h-screen transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className={`${isOpen ? "block" : "hidden"} text-lg font-bold`}>
            MyApp
          </h1>
          <button onClick={toggleSidebar} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <ul className="space-y-4 px-4">
          <li className={`${isOpen ? "block" : "hidden"} flex flex-row gap-4 justify-start items-center`}>
            <FaHome size={24} />
            <Link to={"home"} className="hover:text-blue-300">
              Reportes
            </Link>
          </li>
          <li className={`${isOpen ? "block" : "hidden"} flex flex-row gap-4 justify-start items-center`}>
           <FaCar size={24} />
            <Link to={"CarList"} className="hover:text-blue-300">
              Vehículos
            </Link>
          </li>
          <li className={`${isOpen ? "block" : "hidden"} flex flex-row gap-4 justify-start items-center`}>
            <FaUsers size={24} />
            <Link href="#" className="hover:text-blue-300">
              Usuarios
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold ">CheckCars</h1>
        {/* Aquí iría el contenido principal de tu página */}
      </div>
    </div>
  );
};

export default Navbar;
