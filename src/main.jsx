import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SettingsContext  from "./Context/SettingsContext.jsx";
import {SettingsProvider} from "./Context/SettingsContext.jsx";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SettingsProvider >
      <App />
    </SettingsProvider>
  </React.StrictMode>
);
