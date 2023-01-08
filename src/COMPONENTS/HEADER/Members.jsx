import React from "react";

import axios from "axios";
import Button from "../INPUT/Button";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";

export default function Members(props) {
  const [members, setMembers] = React.useState([]);

  const { url, socket } = useGlobalContext();
  const token = localStorage.getItem("token");
  const user = parseInt(localStorage.getItem("user"));
  const isAdmin = props.roomData?.is_admin;
  const navigate = useNavigate();

  const fetchAllMembers = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/gr/mnl/${props.roomData?.room_code}`, {
        headers: { Authorization: token },
      });
      if (data) {
        setMembers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, url, props.roomData?.room_code]);

  const removeMember = async (member_id) => {
    try {
      const { data } = await axios.patch(
        `${url}/gr/${props.roomData?.room_code}`,
        { member_id },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchAllMembers();
        socketRemoveMember(member_id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const socketRemoveMember = (member_id) => {
    socket.emit("remove-member", member_id);
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanSeeMembers();
    }
  };

  const socketReflectAccept = React.useCallback(() => {
    socket.on("reflect-accept", () => {
      fetchAllMembers();
    });
  }, [socket, fetchAllMembers]);

  const socketReflectAdd = React.useCallback(() => {
    socket.on("reflect-add-member", () => {
      fetchAllMembers();
    });
  }, [socket, fetchAllMembers]);

  const socketReflectLeave = React.useCallback(() => {
    socket.on("reflect-leave", () => {
      fetchAllMembers();
    });
  }, [socket, fetchAllMembers]);

  const socketReflectRemove = React.useCallback(() => {
    socket.on("reflect-remove-member", (member_id) => {
      if (member_id === user) {
        navigate("/comms/ar");
      }
      fetchAllMembers();
    });
  }, [socket, fetchAllMembers, navigate, user]);

  React.useEffect(() => {
    fetchAllMembers();
  }, [fetchAllMembers]);

  React.useEffect(() => {
    socketReflectAccept();
  }, [socketReflectAccept]);

  React.useEffect(() => {
    socketReflectAdd();
  }, [socketReflectAdd]);

  React.useEffect(() => {
    socketReflectLeave();
  }, [socketReflectLeave]);

  React.useEffect(() => {
    socketReflectRemove();
  }, [socketReflectRemove]);

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
          onClick={props.handleCanSeeMembers}
          className="mr-auto scale-125 cursor-pointer"
        />
        {members.map((member) => {
          return (
            <div
              key={member.user_id}
              className={`${
                member.is_admin ? "bg-blk" : "bg-gr3"
              } w-full p-2 rounded-md text-wht cstm-flex justify-start gap-2`}
            >
              <div
                className="w-11 h-11 rounded-full cstm-gbg-1-2 bg-cover bg-center"
                style={{ backgroundImage: member.image && `url(${member.image})` }}
              />
              <div className="truncate mr-auto">
                <div className="font-head font-medium">
                  {member.name} {member.is_admin ? " | admin" : null}
                </div>
                <div className="font-body text-xs font-light">{member.email}</div>
              </div>
              {isAdmin && user !== member.user_id ? (
                <Button
                  onClick={() => removeMember(member.user_id)}
                  label="Axe"
                  css="w-min bg-gr1 text-blk text-xs"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
