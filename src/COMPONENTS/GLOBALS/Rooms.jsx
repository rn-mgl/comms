import React from "react";

import { NavLink } from "react-router-dom";
import { AiOutlineMore } from "react-icons/ai";
import { IoNotificationsOffOutline } from "react-icons/io5";
import { BiBlock } from "react-icons/bi";
import { useGlobalContext } from "../../context";

import RoomOptions from "../ROOMS/RoomOptions";
import axios from "axios";
import ErrMsg from "./ErrMsg";

export default function Rooms(props) {
  const { url } = useGlobalContext();
  const [roomSelected, setRoomSelected] = React.useState({ roomCode: "", roomId: -1 });
  const [err, setErr] = React.useState({ msg: "", active: false });

  const token = localStorage.getItem("token");

  const unfriendUser = async () => {
    try {
      const { data } = await axios.delete(`${url}/dr`, {
        headers: { Authorization: token },
        data: { room_code: roomSelected.roomCode },
      });
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const leaveRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/gr`,
        { room_code: roomSelected.roomCode },
        {
          headers: { Authorization: token },
        }
      );
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const muteDirectRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/dr/mnl/rm`,
        { room_code: roomSelected.roomCode },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const muteGroupRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/gr/mt/rm`,
        { room_code: roomSelected.roomCode },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const blockDirectRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/dr/blck/rm`,
        { room_code: roomSelected.roomCode },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const blockGroupRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/gr/blck/rm`,
        { room_code: roomSelected.roomCode },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleRoomSelected = (room) => {
    setRoomSelected((prev) => (prev === room ? "" : room));
  };

  return (
    <div className="cstm-flex flex-col w-full gap-2">
      <ErrMsg err={err} setErr={setErr} />
      {props.rooms.map((room) => {
        const optionsIsVisible = props.activeBarOptions === room.room_id;
        const roomName =
          room.room_name?.length > 15 ? `${room.room_name.slice(0, 15)}...` : room.room_name;

        return (
          <div className="w-full cstm-flex" key={room.room_id}>
            <NavLink
              className={({ isActive }) =>
                `${isActive ? "bg-gr4 border-blk border-4" : "bg-gr3"} cstm-room-bar `
              }
              to={`/comms/${props.path}/${room.room_code}`}
              onClick={() =>
                props.selectRoom({
                  roomId: room.room_id,
                  roomType: room.room_type,
                  roomFrom: props.path,
                })
              }
            >
              <div className="cstm-flex">
                <div
                  className={
                    !room.room_image &&
                    "cstm-gbg-n1-n4 bg-cover cstm-flex text-blk font-light font-head text-lg capitalize w-9 h-9 rounded-full"
                  }
                  style={{ backgroundImage: room.room_image && `url(${room.room_image})` }}
                >
                  {!room.room_image && room.room_name[0]}
                </div>
                <div
                  className={`${
                    !parseInt(room.is_active) ? "cstm-gbg-red3-red6" : "cstm-gbg-grn3-grn6"
                  } w-4 h-4 rounded-full cstm-flex relative -translate-x-3 translate-y-3`}
                />
              </div>

              <div className="cstm-flex flex-col items-start mr-auto">
                <div className="font-head font-medium text-base">{roomName}</div>
                {!room.is_seen && (
                  <div className="font-body font-light text-xs italic">New Message...</div>
                )}
              </div>
              {room.is_muted ? <IoNotificationsOffOutline /> : null}
              {room.is_blocked ? <BiBlock /> : null}
            </NavLink>
            {optionsIsVisible && (
              <RoomOptions
                room={room}
                unfriendUser={unfriendUser}
                leaveRoom={leaveRoom}
                muteGroupRoom={muteGroupRoom}
                muteDirectRoom={muteDirectRoom}
                blockGroupRoom={blockGroupRoom}
                blockDirectRoom={blockDirectRoom}
              />
            )}
            <AiOutlineMore
              onClick={() => {
                props.handleActiveBarOptions(room.room_id);
                handleRoomSelected({ roomCode: room.room_code, roomId: room.room_id });
              }}
              className="relative cursor-pointer hover:bg-gr1 rounded-md"
            />
          </div>
        );
      })}
    </div>
  );
}
