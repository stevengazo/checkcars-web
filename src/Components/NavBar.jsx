import React, { useState } from "react";
import { FaHome, FaCar, FaUsers, FaCarCrash } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { IoIosExit } from "react-icons/io";

const Navbar = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const DeleteToken = () => {
    localStorage.clear();
    nav("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarOpen = isOpen || isHovering;

  return (
    <div className="flex transition-all duration-300 ease-in-out">
      <div
        className={`
          ${sidebarOpen ? "w-screen md:w-48" : "h-12 md:h-screen w-screen md:w-16"} 
          bg-blue-600 text-white transition-all duration-300 ease-in-out
        `}
        onMouseEnter={() => window.innerWidth >= 768 && setIsHovering(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsHovering(false)}
      >
        <div className="flex justify-between items-center p-4 md:block md:p-2">
          <h1 className={`${sidebarOpen ? "block" : "hidden"} text-lg text-center font-bold`}>
            Check Cars
          </h1>
          {/* Toggle button visible only on mobile */}
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <ul className={`${sidebarOpen ? "block" : "hidden"} text-lg font-bold space-y-4`}>
          {[
            { to: "home", icon: <FaHome size={24} />, label: "Salidas" },
            { to: "issue", icon: <CiWarning size={24} />, label: "Problemas" },
            { to: "crash", icon: <FaCarCrash size={24} />, label: "Accidentes" },
            { to: "CarList", icon: <FaCar size={24} />, label: "Vehículos" },
            { to: "users", icon: <FaUsers size={24} />, label: "Usuarios" },
          ].map(({ to, icon, label }) => (
            <li key={to} className="hover:bg-blue-800 transition duration-500">
              <Link
                to={to}
                className="flex items-center w-full p-3 hover:text-blue-300"
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                {icon}
                <span className={`${sidebarOpen ? "ml-4" : "hidden"}`}>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div
          className={`${
            sidebarOpen ? "w-48" : "w-16"
          } absolute bottom-2 text-white transition-all duration-300 ease-in-out px-4`}
        >
          <div className="flex flex-row items-center p-2 hover:bg-blue-900 transition duration-500 cursor-pointer" onClick={DeleteToken}>
            <IoIosExit size={36} />
            <span className={`${sidebarOpen ? "ml-2" : "hidden"}`}>Cerrar Sesión</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
