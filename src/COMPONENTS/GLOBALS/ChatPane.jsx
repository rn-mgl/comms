import React from "react";

import ChatBar from "../CHAT PANE/ChatBar";
import Header from "../CHAT PANE/Header";
import ErrMsg from "./ErrMsg";
import SendingMsg from "../CHAT PANE/SendingMsg";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";

import * as textFns from "../../FUNCTIONS/textFunc";
import * as fileFns from "../../FUNCTIONS/fileFunc";
import SelectedFile from "../CHAT PANE/SelectedFile";
import MessageInput from "../CHAT PANE/MessageInput";
import ReplyMode from "../CHAT PANE/ReplyMode";

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

  props.notification.volume = 1;
  const { room_code } = useParams();
  const token = localStorage.getItem("token");
  const user = parseInt(localStorage.getItem("user"));
  const navigate = useNavigate();
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
        document.title = "comms by rltn";
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

    if (fileLink?.startsWith("Error")) {
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
            message_file: undefined,
            reply_to: { message_id: -1, message_content: "", message_file: undefined },
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

        document.title = "comms by rltn";
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

  const socketReflectRemove = React.useCallback(() => {
    socket.on("reflect-remove-member", (member_id) => {
      if (member_id === user) {
        navigate("/comms/ar");
      }
      fetchMessages();
      fetchRoomData();
      scrollIntoView();
    });
  }, [socket, fetchMessages, fetchRoomData, user, navigate]);

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

  React.useEffect(() => {
    socketReflectRemove();
  }, [socketReflectRemove]);

  return (
    props.selectedRoom?.roomId !== -1 && (
      <div
        className="absolute top-[4.5rem] bg-white cstm-flex flex-col w-full p-2 gap-3 
                  t:static t:w-7/12
                  l-s:w-8/12
                  l-l:w-9/12"
      >
        <ErrMsg err={err} setErr={setErr} />
        <div className="relative w-full cstm-flex flex-col">
          <Header
            roomData={roomData}
            selectRoom={props.selectRoom}
            roomType={props.selectedRoom?.roomType}
            path={props.path}
            roomPath={roomPath}
            fetchAllRooms={fetchAllRooms}
          />
        </div>

        <div
          className="cstm-flex bg-gr4 w-full h-[61vh] flex-col-reverse 
                    rounded-md px-2 justify-start gap-4 cstm-scrollbar overflow-y-auto
                    l-s:h-[65vh]"
          ref={paneRef}
          onScroll={fetchOnScroll}
        >
          {loading && (
            <AiOutlineLoading3Quarters
              className="absolute top-24 animate-spin text-gr1
                      t:top-44"
            />
          )}
          {willReply && (
            <ReplyMode messageData={messageData} handleReplyTo={() => handleReplyTo(-1, "")} />
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
          roomData={roomData}
          setSelectedFile={setSelectedFile}
        />
      </div>
    )
  );
}
