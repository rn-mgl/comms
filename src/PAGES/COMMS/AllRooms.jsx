import React from "react";

import axios from "axios";
import { useGlobalContext } from "../../context";

import { IoPersonAddOutline } from "react-icons/io5";
import { ImMakeGroup } from "react-icons/im";
import { FaConnectdevelop } from "react-icons/fa";

import Rooms from "../../COMPONENTS/GLOBALS/Rooms";
import SearchBar from "../../COMPONENTS/GLOBALS/SearchBar";
import ChatPane from "../../COMPONENTS/GLOBALS/ChatPane";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";
import Standby from "../../COMPONENTS/CHAT PANE/Standby";
import AddFriend from "./AddFriend";
import MakeGroup from "./MakeGroup";
import JoinGroup from "./JoinGroup";

export default function AllRooms() {
  const { url, socket } = useGlobalContext();
  const [allRooms, setAllRooms] = React.useState([]);
  const [currPath, setCurrPath] = React.useState("ar");
  const [err, setErr] = React.useState({ msg: "", active: false });
  const [activeBarOptions, setActiveBarOptions] = React.useState(-1);
  const [canAddFriend, setCanAddFriend] = React.useState(false);
  const [canMakeGroup, setCanMakeGroup] = React.useState(false);
  const [canJoinGroup, setCanJoinGroup] = React.useState(false);
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
        params: { group_type: currPath === "ar" || "gr" ? "all" : null },
        headers: { Authorization: token },
      });
      if (data) {
        setAllRooms(data);
        setActiveBarOptions(-1);
        data.forEach((room) => socket.emit("join-room", room.room_code));
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, currPath, socket]);

  const selectRoom = (data) => {
    setSelectedRoom(data);
    setActiveBarOptions(-1);
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

  const handleActiveBarOptions = (id) => {
    setActiveBarOptions((prev) => (prev === id ? -1 : id));
  };

  const handleCanAddFriend = () => {
    setCanAddFriend((prev) => !prev);
  };

  const handleCanMakeGroup = () => {
    setCanMakeGroup((prev) => !prev);
  };

  const handleCanJoinGroup = () => {
    setCanJoinGroup((prev) => !prev);
  };

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
      {canAddFriend && <AddFriend handleCanAddFriend={handleCanAddFriend} />}
      {canMakeGroup && (
        <MakeGroup fetchAllRooms={fetchAllRooms} handleCanMakeGroup={handleCanMakeGroup} />
      )}
      {canJoinGroup && (
        <JoinGroup fetchAllRooms={fetchAllRooms} handleCanJoinGroup={handleCanJoinGroup} />
      )}
      <div
        className="w-full p-2 cstm-flex flex-col gap-3 justify-start overflow-y-auto cstm-scrollbar
                    t:mr-auto t:w-5/12
                    l-s:w-4/12
                    l-l:w-3/12"
      >
        <SearchBar allRooms={allRooms} selectRoom={selectRoom} path={currPath} />

        <div className="w-full cstm-flex gap-16 ">
          <div className="cstm-nav-text p-3 cursor-pointer group">
            <IoPersonAddOutline onClick={handleCanAddFriend} className="scale-[1.75]" />
            <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
              Add Friend
            </div>
          </div>
          <div className="cstm-nav-text p-3 cursor-pointer group">
            <ImMakeGroup onClick={handleCanMakeGroup} className="scale-[1.75]" />
            <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
              Make Group
            </div>
          </div>
          <div className="cstm-nav-text p-3 cursor-pointer group">
            <FaConnectdevelop onClick={handleCanJoinGroup} className="scale-[1.75]" />
            <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
              Join Group
            </div>
          </div>
        </div>

        <Rooms
          rooms={allRooms}
          path={currPath}
          selectRoom={selectRoom}
          selectedRoom={selectedRoom}
          activeBarOptions={activeBarOptions}
          handleActiveBarOptions={handleActiveBarOptions}
          fetchAllRooms={fetchAllRooms}
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
