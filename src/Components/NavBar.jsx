import React, { useState } from "react";
import { FaHome, FaCar, FaUsers, FaCarCrash } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { Link } from "react-router-dom";
import { IoIosExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const DeleteToken = () => {
    localStorage.clear();
    nav("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-screen md:w-48  h-screen  " : " h-12 md:h-screen w-screen  md:w-16"
        } bg-blue-600 text-white  transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className={`${isOpen ? "block" : "hidden"} text-lg font-bold`}>
            Check Cars
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
        <ul className="space-y-4">
          <li className="hover:bg-blue-800 transition duration-500">
            <Link
              to="home"
              className="flex items-center w-full p-3 hover:text-blue-300"
            >
              <FaHome size={24} />
              <span className={`${isOpen ? "ml-4" : "hidden"}`}>Salidas</span>
            </Link>
          </li>
          <li className="hover:bg-blue-800 transition duration-500">
            <Link
              to="issue"
              className="flex items-center w-full p-3 hover:text-blue-300"
            >
              <CiWarning size={24} />
              <span className={`${isOpen ? "ml-4" : "hidden"}`}>Problemas</span>
            </Link>
          </li>
          <li className="hover:bg-blue-800 transition duration-500">
            <Link
              to="crash"
              className="flex items-center w-full p-3 hover:text-blue-300"
            >
              <FaCarCrash size={24} />
              <span className={`${isOpen ? "ml-4" : "hidden"}`}>
                Accidentes
              </span>
            </Link>
          </li>
          <li className="hover:bg-blue-800 transition duration-500">
            <Link
              to="CarList"
              className="flex items-center w-full p-3 hover:text-blue-300"
            >
              <FaCar size={24} />
              <span className={`${isOpen ? "ml-4" : "hidden"}`}>Vehículos</span>
            </Link>
          </li>
          <li className="hover:bg-blue-800 transition duration-500">
            <Link
              to="#"
              className="flex items-center w-full p-3 hover:text-blue-300"
            >
              <FaUsers size={24} />
              <span className={`${isOpen ? "ml-4" : "hidden"}`}>Usuarios</span>
            </Link>
          </li>
        </ul>

        <div
          className={`${
            isOpen ? "w-48" : "w-16"
          } absolute bottom-2 text-white transition-all duration-300 ease-in-out px-4 justify-center`}
        >
          <div className="flex flex-row b p-2 hover:to-blue-900 transition duration-500">
            <IoIosExit size={36} />
            <label
              className={`${isOpen ? "ml-2" : "hidden"}`}
              onClick={() => DeleteToken()}
            >
              Cerrar Sesión
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
