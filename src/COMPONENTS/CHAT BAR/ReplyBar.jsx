import React from "react";

import { BsReply } from "react-icons/bs";

import FileViewer from "./FileViewer";

export default function ReplyBar(props) {
  const isFile = props.replyTo?.startsWith("https://res.cloudinary.com/dnzuptxvy");
  const replyTo =
    isFile || props.replyTo.length <= 20 ? props.replyTo : `${props.replyTo.slice(0, 20)}...`;

  return (
    <>
      <div className="cstm-flex flex-wrap gap-2 italic opacity-70 bg-gr2 p-1 rounded-md text-wht">
        {isFile ? <FileViewer file={replyTo} /> : replyTo}

        <BsReply />
      </div>

      <div>{props.messageContent}</div>
    </>
  );
}
