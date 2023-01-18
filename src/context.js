import React from "react";
import { io } from "socket.io-client";
import chord from "./AUDIO/chord.wav";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const url = `https://comms-server.onrender.com`;
  const socket = io(url);
  const notification = new Audio(chord);
  notification.volume = 0.7;

  return (
    <AppContext.Provider value={{ url, socket, notification }}>{children}</AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(AppContext);
};

export { AppContext, AppProvider };
