import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SendingMsg(props) {
  return (
    <div className="w-full text-right">
      <div
        className="ml-auto cstm-sending-bar 
            cstm-chat-bar break-all h-auto max-w-[14rem]
            m-m:max-w-[17rem]
            m-l:max-w-xs"
      >
        {props.messageData.message_content}
      </div>
      <AiOutlineLoading3Quarters className="ml-auto font-body animate-spin w-2 text-gr1" />
    </div>
  );
}
