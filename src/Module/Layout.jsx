import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/NavBar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex flex-row gap-2 h-screen">
        <Navbar />
        {/* Main content */}
        <div className="flex-1 p-6 m-3 border border-blue-200 rounded rounde-md shadow overflow-y-auto overflow-y-scroll">
          {/* Aquí iría el contenido principal de tu página */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
