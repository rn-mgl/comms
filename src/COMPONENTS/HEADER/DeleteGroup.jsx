import React from "react";
import axios from "axios";

import Submit from "../INPUT/Submit";
import Input from "../INPUT/Input";

import { AiOutlineArrowLeft } from "react-icons/ai";
import { useGlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";

export default function DeleteGroup(props) {
  const [confirmation, setConfirmation] = React.useState("");

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");
  const roomName = props.roomData?.room_name;
  const roomCode = props.roomData?.room_code;
  const textConfirmation = `${roomName}-${roomCode.slice(0, 4)}`;
  const navigate = useNavigate();

  const deleteRoom = async (e) => {
    e.preventDefault();

    if (confirmation !== textConfirmation) {
      return;
    }

    try {
      const { data } = await axios.delete(`${url}/gr/${roomCode}`, {
        headers: { Authorization: token },
      });
      if (data) {
        props.fetchAllRooms();
        props.handleCanDeleteGroup();
        navigate("/comms/ar");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanDeleteGroup();
    }
  };

  const handleConfirmation = ({ value }) => {
    setConfirmation(value);
  };

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="fixed cstm-flex top-0 left-0 z-20 backdrop-blur-sm w-full h-full"
    >
      <div
        className="w-11/12 h-min text-center bg-gr1 rounded-md p-2 cstm-flex flex-col gap-4 justify-start shadow-md
                    t:w-6/12"
      >
        <AiOutlineArrowLeft
          onClick={props.handleCanDeleteGroup}
          className="mr-auto scale-125 cursor-pointer"
        />
        <div className="font-body text-sm font-light">
          <span className="font-medium">note:</span> this will{" "}
          <span className="font-medium">permanently delete</span> the group and all related
          messages.
        </div>
        <div className="font-head text-sm">
          enter `<span className="font-bold">{textConfirmation}</span>` to confirm delete
        </div>
        <form className="cstm-flex flex-col w-full gap-2" onSubmit={(e) => deleteRoom(e)}>
          <Input
            name="confirmation"
            type="text"
            value={confirmation}
            placeholder="enter the text to confirm deletion"
            id="confirmation"
            onChange={(e) => handleConfirmation(e.target)}
            required={true}
          />
          <Submit label="Delete" css="bg-blk text-wht w-full text-sm" />
        </form>
      </div>
    </div>
  );
}
