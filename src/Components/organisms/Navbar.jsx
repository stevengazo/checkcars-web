import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCar, FaCarCrash } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { IoIosExit, IoIosCar } from "react-icons/io";
import { MdMenu, MdClose } from "react-icons/md";
import { FiTool } from "react-icons/fi";
import { FaChartSimple, FaWarehouse, FaRoute, FaRegCalendarCheck, FaGear } from "react-icons/fa6";
import { useAuth } from "../../Context/AuthContext";

// Elementos agrupados y reordenados por área funcional. Rutas en minúsculas (ver App.jsx).
const sections = [
  {
    title: null,
    items: [{ to: "/home", icon: <FaChartSimple size={20} />, label: "Inicio" }],
  },
  {
    title: "Flota",
    items: [
      { to: "/carlist", icon: <FaCar size={20} />, label: "Vehículos" },
      { to: "/carservices", icon: <FiTool size={20} />, label: "Servicios" },
    ],
  },
  {
    title: "Operación",
    items: [
      { to: "/exits", icon: <FaRoute size={20} />, label: "Salidas" },
      { to: "/returns", icon: <FaWarehouse size={20} />, label: "Entregas" },
      { to: "/booking", icon: <FaRegCalendarCheck size={20} />, label: "Reservas" },
    ],
  },
  {
    title: "Incidencias",
    items: [
      { to: "/issue", icon: <CiWarning size={22} />, label: "Problemas" },
      { to: "/crash", icon: <FaCarCrash size={20} />, label: "Accidentes" },
    ],
  },
  {
    title: "Administración",
    items: [{ to: "/config", icon: <FaGear size={20} />, label: "Configuración" }],
  },
];

const NavItem = ({ to, icon, label, expanded, onNavigate }) => (
  <li>
    <NavLink
      to={to}
      onClick={onNavigate}
      title={label}
      className={({ isActive }) =>
        `group relative flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200
         ${expanded ? "" : "md:justify-center"}
         ${isActive ? "bg-white/20 font-semibold text-white" : "text-blue-50 hover:bg-white/10"}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-r bg-white md:block" />
          )}
          <span className="shrink-0">{icon}</span>
          <span
            className={`ml-3 whitespace-nowrap transition-all duration-200 ${
              expanded ? "opacity-100" : "w-0 opacity-0 md:hidden"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  </li>
);

const Navbar = () => {
  const nav = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const expanded = isHovering || mobileOpen;
  const handleLogout = () => {
    logout();
    nav("/login");
  };
  const closeOnMobile = () => window.innerWidth < 768 && setMobileOpen(false);
  const initial = user ? String(user).charAt(0).toUpperCase() : "?";

  return (
    <aside
      onMouseEnter={() => window.innerWidth >= 768 && setIsHovering(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsHovering(false)}
      className={`z-30 flex flex-col bg-gradient-to-b from-blue-700 to-blue-600 text-white shadow-lg
        transition-[width,height] duration-300 ease-in-out
        ${expanded ? "w-full md:w-56" : "h-14 w-full md:h-screen md:w-16"}`}
    >
      {/* Marca + toggle móvil */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 md:px-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <IoIosCar size={28} className="shrink-0" />
          <span
            className={`whitespace-nowrap text-lg font-bold tracking-tight transition-all duration-200 ${
              expanded ? "opacity-100" : "w-0 opacity-0 md:hidden"
            }`}
          >
            Check Cars
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded p-1 hover:bg-white/10 md:hidden"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Navegación agrupada */}
      <nav className={`flex-1 overflow-y-auto px-2 py-2 ${expanded ? "block" : "hidden md:block"}`}>
        {sections.map((section, idx) => (
          <div key={section.title ?? "main"} className={idx > 0 ? "mt-3" : ""}>
            {section.title &&
              (expanded ? (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-200/80">
                  {section.title}
                </p>
              ) : (
                <div className="mx-auto my-2 h-px w-6 bg-white/15 md:block" />
              ))}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.to} {...item} expanded={expanded} onNavigate={closeOnMobile} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pie: usuario + cerrar sesión */}
      <div className={`mt-auto border-t border-white/10 p-2 ${expanded ? "block" : "hidden md:block"}`}>
        <div className={`flex items-center gap-2 px-1 py-1 ${expanded ? "" : "md:justify-center"}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            {initial}
          </div>
          {expanded && user && (
            <span className="truncate text-xs text-blue-100" title={String(user)}>
              {String(user)}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className={`mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-blue-50 transition-colors duration-200 hover:bg-white/10 ${
            expanded ? "" : "md:justify-center"
          }`}
        >
          <IoIosExit size={22} className="shrink-0" />
          <span
            className={`ml-3 whitespace-nowrap transition-all duration-200 ${
              expanded ? "opacity-100" : "w-0 opacity-0 md:hidden"
            }`}
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
