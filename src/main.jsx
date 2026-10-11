import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import "./index.css";
import { SettingsProvider } from "./Context/SettingsContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} newestOnTop theme="colored" />
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>
);
