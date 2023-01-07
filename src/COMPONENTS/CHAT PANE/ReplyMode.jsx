import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function ReplyMode(props) {
  return (
    <>
      <div
        className="bg-blk text-wht w-10/12 text-center p-2 rounded-md font-body text-sm cstm-flex absolute z-10
              t:w-96"
      >
        <div className="text-left">
          <div className="font-light">reply to</div>
          <div className="font-semibold text-xs">
            {props.messageData?.reply_to.message_content
              ? props.messageData?.reply_to.message_content?.slice(0, 20)
              : props.messageData?.reply_to.message_file?.split("/")[4]}
          </div>
        </div>
        <AiOutlineCloseCircle
          className="ml-auto cursor-pointer scale-110"
          onClick={props.handleReplyTo}
        />
      </div>
      <div className="my-4" />
    </>
  );
}
