import React from "react";
import Input from "../INPUT/Input";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink } from "react-router-dom";

export default function DynamicBar(props) {
  return (
    <div className="cstm-flex w-full flex-col gap-2">
      <div className="w-full cstm-flex gap-3">
        <Input
          name="search_word"
          type="text"
          value={props.word}
          onChange={(e) => props.handleSearchWord(e.target)}
          placeholder="Search Rooms"
          id="search_word"
          required={false}
          css="rounded-full text-sm"
        />
        <AiOutlineClose onClick={props.activeSearchBar} className="scale-125 cursor-pointer" />
      </div>

      <div
        className="absolute top-2 translate-y-32 shadow-md z-10 bg-gr1 p-3 rounded-md w-full h-4/6 cstm-flex justify-start flex-col gap-3
                      t:w-80
                      l-l:w-96"
      >
        {!props.rooms?.includes(null) ? (
          props.rooms?.map((room) => {
            return (
              <NavLink
                to={`/comms/${props.path}/${room.roomCode}`}
                key={room.roomId}
                onClick={() => {
                  props.selectRoom({
                    roomId: room.roomId,
                    roomType: room.roomType,
                    roomFrom: props.path,
                  });
                  props.activeSearchBar();
                }}
                className="font-head text-sm p-2 w-full bg-gr4  rounded-md text-wht"
              >
                {room.roomName}
              </NavLink>
            );
          })
        ) : (
          <div className="font-body text-sm text-gr2">no room with the word "{props.word}"</div>
        )}
      </div>
    </div>
  );
}
