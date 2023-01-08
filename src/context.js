import React from "react";
import { io } from "socket.io-client";
import chord from "./AUDIO/chord.wav";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const url = `http://192.168.1.121:9000`;
  const socket = io(url);
  const notification = new Audio(chord);

  return (
    <AppContext.Provider value={{ url, socket, notification }}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { AppContext, AppProvider };
