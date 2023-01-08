import React from "react";

import axios from "axios";
import Button from "../INPUT/Button";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { useGlobalContext } from "../../context";

export default function SendJoinRequests(props) {
  const [users, setUsers] = React.useState([]);

  const { url, socket } = useGlobalContext();
  const token = localStorage.getItem("token");

  const fetchAllUsers = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/user/all/user`, {
        headers: { Authorization: token },
      });
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, url]);

  const sendRequest = async (request_to) => {
    try {
      const { data } = await axios.post(
        `${url}/grreq`,
        {
          request_to,
          room_code: props.roomData?.room_code,
          group_name: props.roomData?.room_name,
        },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchAllUsers();
        socketSendRequest();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const socketSendRequest = () => {
    socket.emit("send-request", { msg: "send" });
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanSendJoinRequests();
    }
  };

  React.useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="fixed cstm-flex top-0 left-0 z-20 backdrop-blur-sm w-full h-full"
    >
      <div
        className="w-11/12 h-5/6 bg-gr1 rounded-md p-2 cstm-flex justify-start flex-col gap-2 shadow-md
                    t:w-6/12"
      >
        <AiOutlineArrowLeft
          onClick={props.handleCanSendJoinRequests}
          className="mr-auto scale-125 cursor-pointer"
        />
        {users.map((user) => {
          return (
            <div
              key={user.user_id}
              className="w-full bg-gr3 p-2 rounded-md text-wht cstm-flex justify-start gap-2"
            >
              <div
                className="w-11 h-11 rounded-full cstm-gbg-1-2 bg-cover bg-center"
                style={{ backgroundImage: user.image && `url(${user.image})` }}
              />
              <div
                className="truncate mr-auto w-28
                            m-l:w-min"
              >
                <div className="font-head font-medium">{user.name}</div>
                <div className="font-body text-xs font-light">{user.email}</div>
              </div>

              <Button
                onClick={() => sendRequest(user.user_id)}
                label="Send"
                css="w-min bg-gr1 text-blk text-sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
