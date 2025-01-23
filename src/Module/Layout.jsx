import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 MyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
