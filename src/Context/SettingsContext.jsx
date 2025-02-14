import { createContext, useState } from "react";

// Creamos el contexto
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // URL de la API
  const API_URL = "http://localhost:8080";

  return (
    <SettingsContext.Provider value={{ API_URL }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export default SettingsContext;
