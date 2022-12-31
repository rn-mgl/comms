import React from "react";
import { AiOutlineMore } from "react-icons/ai";
import * as dateFns from "../../FUNCTIONS/dateFunc";
import FileViewer from "../CHAT BAR/FileViewer";
import UnsentMsg from "./UnsentMsg";

export default function ChatBar(props) {
  const user = parseInt(localStorage.getItem("user"));

  return props.messages.map((message) => {
    const isSelected = props.selectedMessage === message.message_id;
    const isSender = user === message.sender_id;
    const messageContent =
      message.message_content && message.message_file ? (
        <>
          <FileViewer file={message.message_file} />
          <div className="cstm-divider" />
          {message.message_content ? message.message_content : null}
        </>
      ) : message.message_content ? (
        message.message_content
      ) : message.message_file ? (
        <FileViewer file={message.message_file} />
      ) : (
        false
      );

    return (
      <div className="w-full" key={message.message_id}>
        {isSelected && (
          <div
            className={`${
              isSender ? "text-right" : "text-left"
            } text-wht font-body font-light text-xs mb-1 text-opacity-70`}
          >
            {message.sender_name}
          </div>
        )}

        <div className={`${isSender ? "ml-auto" : "mr-auto"} cstm-flex w-max`}>
          {isSelected && (
            <AiOutlineMore color="white" className={`${isSender ? "order-1" : "order-2"}`} />
          )}

          <div
            onClick={() => props.selectMessage(message.message_id)}
            className={`${isSender ? "order-2 cstm-sender-bar" : "order-1 cstm-receiver-bar"}
                        ${!messageContent && "opacity-50"}
                        cstm-chat-bar break-all h-auto max-w-[14rem] whitespace-pre-line
                        m-m:max-w-[17rem]
                        m-l:max-w-xs`}
          >
            {messageContent ? messageContent : <UnsentMsg sender={message.sender_name} />}
          </div>
        </div>

        {isSelected && (
          <div
            className={`${
              isSender ? "text-right" : "text-left"
            } text-wht font-body font-light text-xs mb-1 text-opacity-50`}
          >
            sent {dateFns.dateAndTime(message.date_created)}
          </div>
        )}
      </div>
    );
  });
}
