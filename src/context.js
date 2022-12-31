import React from "react";
import { io } from "socket.io-client";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const url = `http://192.168.1.121:9000`;
  const socket = io(url);

  return <AppContext.Provider value={{ url, socket }}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { AppContext, AppProvider };
