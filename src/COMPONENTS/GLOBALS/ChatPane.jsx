import React from "react";

import ChatBar from "../CHAT PANE/ChatBar";
import Header from "../CHAT PANE/Header";
import ErrMsg from "./ErrMsg";
import SendingMsg from "../CHAT PANE/SendingMsg";

import { AiOutlineCloseCircle } from "react-icons/ai";

import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";

import * as textFns from "../../FUNCTIONS/textFunc";
import * as fileFns from "../../FUNCTIONS/fileFunc";
import SelectedFile from "../CHAT PANE/SelectedFile";
import MessageInput from "../CHAT PANE/MessageInput";

export default function ChatPane({ fetchAllRooms, ...props }) {
  const { url, socket } = useGlobalContext();

  const [roomData, setRoomData] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fetchLimit, setFetchLimit] = React.useState(20);
  const [selectedMessage, setSelectedMessage] = React.useState(-1);
  const [err, setErr] = React.useState({ msg: "", active: false });
  const [selectedFile, setSelectedFile] = React.useState({
    fileUrl: undefined,
    fileType: undefined,
    fileName: "",
  });
  const [messageData, setMessageData] = React.useState({
    room_id: -1,
    message_content: "",
    message_file: undefined,
    reply_to: { message_id: -1, message_content: "", message_file: undefined },
  });
  const paneRef = React.useRef();
  const bottomRef = React.useRef();

  const { room_code } = useParams();
  const token = localStorage.getItem("token");
  const messagePath = props.selectedRoom?.roomType === "direct" ? "dm" : "gm";
  const roomPath = props.selectedRoom?.roomType === "direct" ? "dr" : "gr";
  const willReply =
    messageData.reply_to.message_id &&
    (messageData.reply_to.message_content || messageData.reply_to.message_file);

  const fetchMessages = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/${messagePath}/room/${room_code}`, {
        params: { limit: fetchLimit },
        headers: { Authorization: token },
      });
      if (data) {
        setMessages(data);
        setSending(false);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
    setLoading(false);
  }, [room_code, token, url, messagePath, fetchLimit]);

  const fetchRoomData = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/${roomPath}/${room_code}`, {
        headers: { Authorization: token },
      });
      if (data) {
        setRoomData(data);
        setMessageData((prev) => {
          return {
            ...prev,
            reply_to: { message_id: -1, message_content: "", message_file: undefined },
            room_id: data.room_id,
          };
        });
        fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [room_code, token, url, roomPath, fetchAllRooms]);

  const sendMessage = async (e) => {
    e.preventDefault();
    let fileLink = undefined;
    const { room_id, message_content, message_file, reply_to } = messageData;
    if (textFns.isEmpty(message_content) && !message_file) {
      setErr({ msg: "Enter a message first before sending.", active: true });
      return;
    }
    setSending(true);
    if (message_file) {
      fileLink = await fileFns.uploadFile(
        e.target.message_file.files[0],
        url,
        setSelectedFile,
        setErr
      );
    }
    if (fileLink.startsWith("Error")) {
      setErr({ msg: fileLink, active: true });
      setSending(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${url}/${messagePath}/room/${room_code}`,
        {
          room_id,
          message_content: message_content === "" ? null : message_content,
          reply_to: reply_to.message_id === -1 ? null : reply_to.message_id,
          message_file: fileLink ? fileLink : null,
        },
        { headers: { Authorization: token } }
      );
      if (data) {
        setMessageData((prev) => {
          return {
            ...prev,
            message_content: "",
          };
        });
        setSelectedFile({
          fileUrl: undefined,
          fileType: undefined,
          fileName: "",
        });
        handleReplyTo(-1, "");
        socketSendMessage();
        fetchMessages();
        fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
      setSending(false);
    }
  };

  const socketJoinRoom = React.useCallback(() => {
    socket.emit("join-room", room_code);
  }, [room_code, socket]);

  const socketReflectLogin = React.useCallback(() => {
    socket.on("reflect-login", () => {
      fetchRoomData();
    });
  }, [fetchRoomData, socket]);

  const socketReflectLogout = React.useCallback(() => {
    socket.on("reflect-logout", () => {
      fetchRoomData();
    });
  }, [fetchRoomData, socket]);

  const socketReceiveMessage = React.useCallback(() => {
    socket.on("receive-message", () => {
      fetchMessages();
      scrollIntoView();
    });
  }, [socket, fetchMessages]);

  const unselectFile = () => {
    setSelectedFile({
      fileUrl: undefined,
      fileType: undefined,
      fileName: "",
    });
  };

  const socketSendMessage = () => {
    socket.emit("send-message", { msg: messageData.message_content });
    scrollIntoView();
  };

  const scrollIntoView = () => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectMessage = (id) => {
    setSelectedMessage((prev) => (prev === id ? -1 : id));
  };

  const handleMessageData = ({ name, value }) => {
    setMessageData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleReplyTo = (id, content, file) => {
    setMessageData((prev) => {
      return {
        ...prev,
        reply_to: { message_id: id, message_content: content, message_file: file },
      };
    });
  };

  const fetchOnScroll = () => {
    const el = paneRef.current;
    const pos = el.clientHeight + -el.scrollTop;

    if (Math.ceil(pos) >= el.scrollHeight - 10) {
      setFetchLimit((prev) => prev + 10);
      fetchMessages();
    }
  };

  React.useEffect(() => {
    socketJoinRoom();
  }, [socketJoinRoom]);

  React.useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  React.useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  React.useEffect(() => {
    socketReflectLogin();
  }, [socketReflectLogin]);

  React.useEffect(() => {
    socketReflectLogout();
  }, [socketReflectLogout]);

  React.useEffect(() => {
    socketReceiveMessage();
  }, [socketReceiveMessage]);

  return (
    props.selectedRoom?.roomId !== -1 && (
      <div
        className="absolute top-[4.5rem] bg-white cstm-flex flex-col w-full p-2 gap-3 
                  t:static t:w-7/12
                  l-s:w-8/12
                  l-l:w-9/12"
      >
        <ErrMsg err={err} setErr={setErr} />
        <div className="relative overflow-hidden w-full cstm-flex flex-col">
          <Header
            roomData={roomData}
            selectRoom={props.selectRoom}
            roomType={props.selectedRoom?.roomType}
            path={props.path}
            roomPath={roomPath}
          />
          {loading && <div className="cstm-loader" />}
        </div>

        <div
          className="cstm-flex bg-gr4 w-full h-[61vh] flex-col-reverse 
                    rounded-md px-2 justify-start gap-4 cstm-scrollbar overflow-y-auto
                    l-s:h-[65vh]"
          ref={paneRef}
          onScroll={fetchOnScroll}
        >
          {willReply && (
            <>
              <div
                className="bg-blk text-wht w-10/12 text-center p-2 rounded-md font-body text-sm cstm-flex absolute z-10
                          t:w-96"
              >
                <div className="text-left">
                  <div className="font-light">reply to</div>
                  <div className="font-semibold text-xs">
                    {messageData.reply_to.message_content
                      ? messageData.reply_to.message_content?.slice(0, 20)
                      : messageData.reply_to.message_file?.split("/")[4]}
                  </div>
                </div>
                <AiOutlineCloseCircle
                  className="ml-auto cursor-pointer scale-110"
                  onClick={() => handleReplyTo(-1, "")}
                />
              </div>
              <div className="my-4" />
            </>
          )}
          <div ref={bottomRef} className="float-left clear-both" />

          {selectedFile.fileUrl && (
            <SelectedFile unselectFile={unselectFile} selectedFile={selectedFile} />
          )}
          {sending && <SendingMsg messageData={messageData} />}
          <ChatBar
            messages={messages}
            messagePath={messagePath}
            fetchMessages={fetchMessages}
            selectMessage={selectMessage}
            selectedMessage={selectedMessage}
            handleReplyTo={handleReplyTo}
            roomData={roomData}
          />
        </div>

        <MessageInput
          sendMessage={sendMessage}
          messageData={messageData}
          handleMessageData={handleMessageData}
          isBlocked={roomData?.is_blocked}
          setSelectedFile={setSelectedFile}
        />
      </div>
    )
  );
}
