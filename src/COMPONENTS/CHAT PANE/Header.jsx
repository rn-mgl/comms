import React from "react";

import { AiOutlineCloseCircle, AiOutlineMore } from "react-icons/ai";
import { NavLink, useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";

import axios from "axios";
import ErrMsg from "../GLOBALS/ErrMsg";
import GroupOptions from "../HEADER/GroupOptions";

import AddMember from "../HEADER/AddMember";
import DeleteGroup from "../HEADER/DeleteGroup";
import SendJoinRequests from "../HEADER/SendJoinRequests";
import Members from "../HEADER/Members";
import UpdateGroup from "../HEADER/UpdateGroup";

export default function Header(props) {
  const { url } = useGlobalContext();
  const { room_code } = useParams();
  const [canSeeGroupOptions, setCanSeeGroupOptions] = React.useState(false);
  const [canAddMember, setCanAddMember] = React.useState(false);
  const [canSendJoinRequest, setCanSendJoinRequest] = React.useState(false);
  const [canDeleteGroup, setCanDeleteGroup] = React.useState(false);
  const [canSeeMembers, setCanSeeMembers] = React.useState(false);
  const [canUpdateGroup, setCanUpdateGroup] = React.useState(false);
  const [err, setErr] = React.useState({ msg: "", active: false });

  const token = localStorage.getItem("token");

  const closeRoom = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/${props.roomPath}/psv/${room_code}`,
        { is_open: 0 },
        { headers: { Authorization: token } }
      );
      if (data) {
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleCanSeeGroupOptions = () => {
    setCanSeeGroupOptions((prev) => !prev);
  };

  const handleCanAddMember = () => {
    setCanAddMember((prev) => !prev);
  };

  const handleCanSendJoinRequests = () => {
    setCanSendJoinRequest((prev) => !prev);
  };

  const handleCanDeleteGroup = () => {
    setCanDeleteGroup((prev) => !prev);
  };

  const handleCanSeeMembers = () => {
    setCanSeeMembers((prev) => !prev);
  };

  const handleCanUpdateGroup = () => {
    setCanUpdateGroup((prev) => !prev);
  };

  const clearLocalStorageRoom = () => {
    localStorage.removeItem("roomId");
    localStorage.removeItem("roomType");
    localStorage.removeItem("roomFrom");
  };

  return (
    <div className="w-full bg-gr1 rounded-md p-3 gap-3 cstm-flex t:justify-start">
      <ErrMsg err={err} setErr={setErr} />

      {props.roomType === "group" && canSeeGroupOptions && (
        <GroupOptions
          roomData={props.roomData}
          handleCanAddMember={handleCanAddMember}
          handleCanDeleteGroup={handleCanDeleteGroup}
          handleCanSendJoinRequests={handleCanSendJoinRequests}
          handleCanSeeMembers={handleCanSeeMembers}
          handleCanUpdateGroup={handleCanUpdateGroup}
        />
      )}

      {canAddMember && (
        <AddMember roomData={props.roomData} handleCanAddMember={handleCanAddMember} />
      )}

      {canDeleteGroup && (
        <DeleteGroup
          fetchAllRooms={props.fetchAllRooms}
          roomData={props.roomData}
          handleCanDeleteGroup={handleCanDeleteGroup}
        />
      )}

      {canSendJoinRequest && (
        <SendJoinRequests
          roomData={props.roomData}
          handleCanSendJoinRequests={handleCanSendJoinRequests}
        />
      )}

      {canSeeMembers && (
        <Members roomData={props.roomData} handleCanSeeMembers={handleCanSeeMembers} />
      )}

      {canUpdateGroup && (
        <UpdateGroup
          fetchRoomData={props.fetchRoomData}
          roomData={props.roomData}
          handleCanUpdateGroup={handleCanUpdateGroup}
        />
      )}

      <div className="cstm-flex">
        <div
          className="cstm-gbg-1-3 bg-cover cstm-flex text-blk font-light font-head text-lg capitalize w-12 h-12 rounded-full"
          style={{
            backgroundImage: props.roomData?.room_image && `url(${props.roomData?.room_image})`,
          }}
        />
        <div
          className={`${
            !parseInt(props.roomData?.is_active) ? "cstm-gbg-red3-red6" : "cstm-gbg-grn3-grn6"
          } w-4 h-4 rounded-full cstm-flex absolute translate-x-4 translate-y-4`}
        />
      </div>

      <div className="mr-auto cstm-flex gap-23">
        <div>
          <div className="font-head font-semibold">{props.roomData?.room_name}</div>
          <div className="font-body text-xs font-light">
            {props.roomData?.is_active ? "Active" : "Offline"}
          </div>
        </div>
        {props.roomType === "group" && (
          <AiOutlineMore className="cursor-pointer" onClick={handleCanSeeGroupOptions} />
        )}
      </div>
      <NavLink to={`/comms/${props.path}`}>
        <AiOutlineCloseCircle
          className="scale-125"
          onClick={() => {
            props.selectRoom({
              roomId: -1,
              roomType: undefined,
              roomFrom: undefined,
            });
            clearLocalStorageRoom();
            closeRoom();
          }}
        />
      </NavLink>
    </div>
  );
}
