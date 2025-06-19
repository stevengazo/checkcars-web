import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCar, FaUsers, FaCarCrash } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { IoIosExit } from "react-icons/io";
import { TbBrandBooking } from "react-icons/tb";
import { MdMoreTime } from "react-icons/md";
import { FaChartSimple, FaWarehouse } from "react-icons/fa6";

const navItems = [
  { to: "home", icon: <FaChartSimple size={24} />, label: "Gráficas" },
  { to: "booking", icon: <MdMoreTime size={24} />, label: "Reservas" },
  { to: "CarList", icon: <FaCar size={24} />, label: "Vehículos" },
  { to: "users", icon: <FaUsers size={24} />, label: "Usuarios" },
  { to: "carservices", icon: <MdMoreTime size={24} />, label: "Servicios" },
  { to: "exits", icon: <FaHome size={24} />, label: "Salidas" },
  { to: "returns", icon: <FaWarehouse size={24} />, label: "Entregas" },
  { to: "issue", icon: <CiWarning size={24} />, label: "Problemas" },
  { to: "crash", icon: <FaCarCrash size={24} />, label: "Accidentes" },
];

const Navbar = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    nav("/");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const sidebarOpen = isOpen || isHovering;

  return (
    <div className="flex transition-all duration-300 ease-in-out">
      <div
        className={`bg-blue-600 text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-screen md:w-48" : "h-12 md:h-screen w-screen md:w-16"
        }`}
        onMouseEnter={() => window.innerWidth >= 768 && setIsHovering(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setIsHovering(false)}
      >
        {/* Header & Mobile Toggle */}
        <div className="flex justify-between items-center p-4 md:block md:p-2">
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-center">Check Cars</h1>
          )}
          <button onClick={toggleSidebar} className="text-white md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <ul
          className={`space-y-2 font-semibold ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          {navItems.map(({ to, icon, label }) => (
            <li key={to} className="hover:bg-blue-800 transition duration-300">
              <Link
                to={to}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className="flex items-center p-3 hover:text-blue-300"
              >
                {icon}
                <span className={`ml-4 ${sidebarOpen ? "inline" : "hidden"}`}>
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div
          className={`absolute bottom-2 transition-all duration-300 px-4 ${
            sidebarOpen ? "w-48" : "w-16"
          }`}
        >
          <div
            onClick={handleLogout}
            className="flex items-center p-2 cursor-pointer hover:bg-blue-900 transition duration-300"
          >
            <IoIosExit size={28} />
            <span className={`ml-2 ${sidebarOpen ? "inline" : "hidden"}`}>
              Cerrar Sesión
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
