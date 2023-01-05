import React from "react";

import { AiOutlineSearch } from "react-icons/ai";

export default function StaticBar(props) {
  return (
    <div
      onClick={props.activeSearchBar}
      className="cursor-pointer cstm-flex w-full bg-gr1 p-3 px-4 italic font-body text-sm text-gr2 rounded-full"
    >
      Search Rooms
      <AiOutlineSearch className="ml-auto scale-110" />
    </div>
  );
}
