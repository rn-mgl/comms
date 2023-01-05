import React from "react";

import { AiOutlineEdit } from "react-icons/ai";

export default function SingleData(props) {
  return (
    <div
      className="cstm-flex gap-3 w-10/12
            t:flex-col t:gap-1 t:w-full"
    >
      <div
        className={`${props.label === "date joined" && "mr-auto t:mr-0"} 
                        font-head font-semibold bg-gr3 p-2 py-1 rounded-md text-wht`}
      >
        {props.label}
      </div>
      <div className={`${!props.value && "italic font-light"} font-body`}>
        {!props.value ? "none" : props.value}
      </div>
      {props.onClickFns && (
        <AiOutlineEdit
          className="ml-auto text-blk opacity-80 cursor-pointer
        t:mx-auto"
          onClick={props.onClickFns}
        />
      )}
    </div>
  );
}
