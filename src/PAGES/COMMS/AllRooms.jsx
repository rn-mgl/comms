import React from "react";

import axios from "axios";
import { useGlobalContext } from "../../context";

import Rooms from "../../COMPONENTS/GLOBALS/Rooms";
import SearchBar from "../../COMPONENTS/GLOBALS/SearchBar";
import ChatPane from "../../COMPONENTS/GLOBALS/ChatPane";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";
import Standby from "../../COMPONENTS/CHAT PANE/Standby";

export default function AllRooms() {
  const { url, socket } = useGlobalContext();
  const [allRooms, setAllRooms] = React.useState([]);
  const [currPath, setCurrPath] = React.useState("ar");
  const [err, setErr] = React.useState({ msg: "", active: false });
  const [selectedRoom, setSelectedRoom] = React.useState({
    roomId: -1,
    roomType: undefined,
    roomFrom: undefined,
  });

  const token = localStorage.getItem("token");
  const path = window.location.pathname.split("/");

  const fetchAllRooms = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/${currPath}`, {
        headers: { Authorization: token },
      });
      if (data) {
        setAllRooms(data);
        data.forEach((room) => socket.emit("join-room", room.room_code));
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error.response.data.msg, active: true });
    }
  }, [token, url, currPath, socket]);

  const selectRoom = (data) => {
    setSelectedRoom(data);
    localStorage.setItem("roomId", data.roomId);
    localStorage.setItem("roomType", data.roomType);
    localStorage.setItem("roomFrom", data.roomFrom);
  };

  const socketReflectLogin = React.useCallback(() => {
    socket.on("reflect-login", () => {
      fetchAllRooms();
    });
  }, [fetchAllRooms, socket]);

  const socketReflectLogout = React.useCallback(() => {
    socket.on("reflect-logout", () => {
      fetchAllRooms();
    });
  }, [fetchAllRooms, socket]);

  const socketReceiveMessage = React.useCallback(() => {
    socket.on("receive-message", () => {
      fetchAllRooms();
    });
  }, [socket, fetchAllRooms]);

  React.useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);

  React.useEffect(() => {
    setCurrPath(path[2]);
  }, [path]);

  React.useEffect(() => {
    socketReflectLogin();
  }, [socketReflectLogin]);

  React.useEffect(() => {
    socketReflectLogout();
  }, [socketReflectLogout]);

  React.useEffect(() => {
    socketReceiveMessage();
  }, [socketReceiveMessage]);

  React.useEffect(() => {
    if (localStorage.getItem("roomId")) {
      setSelectedRoom({
        roomId: localStorage.getItem("roomId"),
        roomType: localStorage.getItem("roomType"),
        roomFrom: localStorage.getItem("roomFrom"),
      });
    }
  }, []);

  return (
    <div
      className="cstm-flex flex-col gap-3 max-h-screen p-3
                 t:flex-row t:items-start"
    >
      <ErrMsg err={err} setErr={setErr} />
      <div
        className="w-full p-2 cstm-flex flex-col gap-3 justify-start overflow-y-auto cstm-scrollbar
                    t:mr-auto t:w-5/12
                    l-s:w-4/12
                    l-l:w-3/12"
      >
        <SearchBar allRooms={allRooms} selectRoom={selectRoom} path={currPath} />
        <Rooms
          rooms={allRooms}
          path={currPath}
          selectRoom={selectRoom}
          selectedRoom={selectedRoom}
        />
      </div>

      {selectedRoom.roomId !== -1 && path[3] ? (
        <ChatPane
          selectedRoom={selectedRoom}
          selectRoom={selectRoom}
          path={currPath}
          fetchAllRooms={fetchAllRooms}
        />
      ) : (
        <Standby />
      )}
    </div>
  );
}
