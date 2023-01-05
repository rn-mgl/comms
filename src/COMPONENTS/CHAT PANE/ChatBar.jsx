import axios from "axios";
import React from "react";

import { AiOutlineMore } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import * as dateFns from "../../FUNCTIONS/dateFunc";

import BarMoreOptions from "../CHAT BAR/BarMoreOptions";
import FileViewer from "../CHAT BAR/FileViewer";
import ReplyBar from "../CHAT BAR/ReplyBar";
import ErrMsg from "../GLOBALS/ErrMsg";
import UnsentMsg from "./UnsentMsg";

export default function ChatBar(props) {
  const { url, socket } = useGlobalContext();
  const [barShownOptions, setBarShownOptions] = React.useState(-1);
  const [err, setErr] = React.useState({ msg: "", active: false });

  const isBlocked = props.roomData?.is_blocked;
  const user = parseInt(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { room_code } = useParams();

  const unsendMessage = async (id) => {
    try {
      const { data } = await axios.patch(
        `${url}/${props.messagePath}/room/${room_code}`,
        { message_id: id },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchMessages();
        socket.emit("send-message", { msg: "unsent" });
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const deleteMessage = async (id) => {
    try {
      const { data } = await axios.patch(
        `${url}/${props.messagePath}/msg/${id}`,
        { message_id: id },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchMessages();
        socket.emit("send-message", { msg: "unsent" });
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleBarMoreOptions = (id) => {
    setBarShownOptions((prev) => (prev === id ? -1 : id));
  };

  return props.messages.map((message) => {
    const isSelected = props.selectedMessage === message.message_id;
    const isSender = user === message.sender_id;
    const optionsIsVisible = message.message_id === barShownOptions;
    const isUnsent = !message.message_content && !message.message_file;
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
        <ErrMsg err={err} setErr={setErr} />

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
          {optionsIsVisible && !isBlocked && (
            <BarMoreOptions
              isSender={isSender}
              selectMessage={props.selectMessage}
              handleBarMoreOptions={handleBarMoreOptions}
              handleReplyTo={() =>
                props.handleReplyTo(
                  message.message_id,
                  message.message_content,
                  message.message_file
                )
              }
              unsendMessage={() => unsendMessage(message.message_id)}
              deleteMessage={() => deleteMessage(message.message_id)}
            />
          )}

          {isSelected && !isBlocked && !isUnsent && (
            <AiOutlineMore
              onClick={() => handleBarMoreOptions(message.message_id)}
              color="white"
              className={`${isSender ? "order-1" : "order-2"} cursor-pointer`}
            />
          )}

          <div
            onClick={() => {
              props.selectMessage(message.message_id);
              handleBarMoreOptions(-1);
            }}
            className={`${isSender ? "order-2 cstm-sender-bar" : "order-1 cstm-receiver-bar"}
                      ${!messageContent && "opacity-50"}
                      cstm-chat-bar break-all h-auto max-w-[14rem] whitespace-pre-line
                      m-m:max-w-[17rem]
                      m-l:max-w-xs`}
          >
            {messageContent && message.reply_to ? (
              <ReplyBar replyTo={message.reply_to} messageContent={messageContent} />
            ) : messageContent ? (
              messageContent
            ) : (
              <UnsentMsg sender={message.sender_name} />
            )}
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
