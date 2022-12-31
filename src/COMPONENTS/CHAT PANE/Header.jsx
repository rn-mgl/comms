import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { NavLink, useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function Header(props) {
  const { url } = useGlobalContext();
  const { room_code } = useParams();
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
      setErr({ msg: error.response.data.msg, active: true });
    }
  };
  const clearLocalStorageRoom = () => {
    localStorage.removeItem("roomId");
    localStorage.removeItem("roomType");
    localStorage.removeItem("roomFrom");
  };

  return (
    <div className="w-full bg-gr1 rounded-md p-3 gap-3 cstm-flex t:justify-start">
      <ErrMsg err={err} setErr={setErr} />
      <div className="cstm-flex">
        <div
          className={
            !props.roomData?.room_image &&
            "cstm-gbg-1-3 cstm-flex text-blk font-light font-head text-lg capitalize w-12 h-12 rounded-full"
          }
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

      <div className="mr-auto">
        <div className="font-head font-semibold">{props.roomData?.room_name}</div>
        <div className="font-body text-xs font-light">
          {props.roomData?.is_active ? "Active" : "Offline"}
        </div>
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
