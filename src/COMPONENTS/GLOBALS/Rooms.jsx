import React from "react";
import { NavLink } from "react-router-dom";

export default function Rooms(props) {
  return (
    <div className="cstm-flex flex-col w-full gap-2">
      {props.rooms.map((room) => {
        return (
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "bg-gr4 border-blk border-4" : "bg-gr3"} cstm-room-bar `
            }
            key={room.room_id}
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
                  "cstm-gbg-n1-n4 cstm-flex text-blk font-light font-head text-lg capitalize w-9 h-9 rounded-full"
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
              <div className="font-head font-medium text-base">{room.room_name}</div>
              {!room.is_seen && (
                <div className="font-body font-light text-xs italic">New Message...</div>
              )}
            </div>
          </NavLink>
        );
      })}
    </div>
  );
}
