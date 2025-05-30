import { createContext } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <SettingsContext.Provider value={{ API_URL }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
