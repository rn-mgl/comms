import React from "react";
import { IoPersonAddOutline } from "react-icons/io5";
import { ImMakeGroup } from "react-icons/im";
import { FaConnectdevelop } from "react-icons/fa";

export default function AllRoomsActions(props) {
  return (
    <div className="w-full cstm-flex gap-16 ">
      <div className="cstm-nav-text p-3 cursor-pointer group">
        <IoPersonAddOutline onClick={props.handleCanAddFriend} className="scale-[1.75]" />
        <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
          Add Friend
        </div>
      </div>
      <div className="cstm-nav-text p-3 cursor-pointer group">
        <ImMakeGroup onClick={props.handleCanMakeGroup} className="scale-[1.75]" />
        <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
          Make Group
        </div>
      </div>
      <div className="cstm-nav-text p-3 cursor-pointer group">
        <FaConnectdevelop onClick={props.handleCanJoinGroup} className="scale-[1.75]" />
        <div className="cstm-nav-hover-text translate-y-5 bg-gr1 text-blk -translate-x-11">
          Join Group
        </div>
      </div>
    </div>
  );
}
