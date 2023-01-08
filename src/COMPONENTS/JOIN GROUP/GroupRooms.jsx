import React from "react";

import { useGlobalContext } from "../../context";

import Button from "../INPUT/Button";
import axios from "axios";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function GroupRooms(props) {
  const [rooms, setRooms] = React.useState([]);
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url, socket } = useGlobalContext();
  const token = localStorage.getItem("token");
  const isPublic = props.groupType === "public";

  const fetchGroupRooms = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/gr`, {
        params: { group_type: props.groupType },
        headers: { Authorization: token },
      });
      if (data) {
        setRooms(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, props.groupType]);

  const sendJoinRequest = async (adminId, roomCode, roomName) => {
    try {
      const { data } = await axios.post(
        `${url}/grreq`,
        { request_to: adminId, room_code: roomCode, group_name: roomName },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchGroupRooms();
        socketSendRequest();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const joinPublicRoom = async (roomCode) => {
    try {
      const { data } = await axios.post(
        `${url}/gr/mnl/${roomCode}`,
        { room_code: roomCode },
        {
          headers: { Authorization: token },
        }
      );
      if (data) {
        fetchGroupRooms();
        props.fetchAllRooms();
        socketJoinRoom();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const socketSendRequest = () => {
    socket.emit("send-request", { msg: "send" });
  };

  const socketJoinRoom = () => {
    socket.emit("add-member", { msg: "add" });
  };

  React.useEffect(() => {
    fetchGroupRooms();
  }, [fetchGroupRooms]);

  return rooms.map((room) => {
    const onClickFns = isPublic
      ? () => joinPublicRoom(room.room_code)
      : () => sendJoinRequest(room.member_id, room.room_code, room.room_name);
    const btnLabel = isPublic ? "Join" : "Request to Join";

    return (
      <div
        key={room.room_id}
        className="w-full bg-blk p-2 rounded-md text-wht font-head cstm-flex gap-5
                  l-l:w-9/12"
      >
        <ErrMsg err={err} setErr={setErr} />
        <div className="mr-auto w-full truncate">
          <div className="font-semibold">{room.room_name}</div>
          <div className="font-body text-sm">by: {room.admin}</div>
        </div>

        <Button
          onClick={onClickFns}
          css="m-l:min-w-fit w-fit text-sm bg-gr1 text-blk"
          label={btnLabel}
        />
      </div>
    );
  });
}
