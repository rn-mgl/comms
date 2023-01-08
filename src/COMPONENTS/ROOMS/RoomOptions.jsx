import React from "react";

export default function RoomOptions(props) {
  const isDirect = props.room.room_type === "direct";
  const isMuted = props.room.is_muted;
  const isBlocked = props.room.is_blocked;
  const leaveRoomFunction = isDirect ? props.unfriendUser : props.leaveRoom;
  const muteRoomFunction = isDirect ? props.muteDirectRoom : props.muteGroupRoom;
  const blockRoomFunction = isDirect ? props.blockDirectRoom : null;
  const user = parseInt(localStorage.getItem("user"));

  return (
    <div
      className="absolute z-10 bg-gr2 rounded-md w-64 text-center cstm-flex gap-1 text-wht p-2 font-body -translate-x-2 shadow-md
                m-m:w-[19rem]
                m-l:w-[22rem]
                t:w-64
                l-s:w-72
                l-l:w-80"
    >
      {isMuted ? (
        <div className="cstm-chat-options" onClick={muteRoomFunction}>
          Unmute
        </div>
      ) : (
        <div className="cstm-chat-options" onClick={muteRoomFunction}>
          Mute
        </div>
      )}

      {isDirect ? (
        <div className="cstm-chat-options" onClick={leaveRoomFunction}>
          Unfriend
        </div>
      ) : (
        <div className="cstm-chat-options" onClick={leaveRoomFunction}>
          Leave
        </div>
      )}
      {isDirect &&
        (isBlocked && user === isBlocked ? (
          <div className="cstm-chat-options" onClick={blockRoomFunction}>
            Unblock
          </div>
        ) : !isBlocked ? (
          <div className="cstm-chat-options" onClick={blockRoomFunction}>
            Block
          </div>
        ) : null)}
    </div>
  );
}
