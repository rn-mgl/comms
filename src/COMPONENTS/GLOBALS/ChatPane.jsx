import React from "react";

import ChatBar from "../CHAT PANE/ChatBar";
import Header from "../CHAT PANE/Header";
import TextArea from "../INPUT/TextArea";

import { AiOutlineSend } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";
import ErrMsg from "./ErrMsg";
import SendingMsg from "../CHAT PANE/SendingMsg";
import IconInput from "../INPUT/IconInput";

import * as textFns from "../../FUNCTIONS/textFunc";
import SelectedFile from "../CHAT PANE/SelectedFile";

export default function ChatPane({ fetchAllRooms, ...props }) {
  const { url, socket } = useGlobalContext();

  const [roomData, setRoomData] = React.useState({});
  const [messages, setMessages] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fetchLimit, setFetchLimit] = React.useState(10);
  const [selectedMessage, setSelectedMessage] = React.useState(-1);
  const [err, setErr] = React.useState({ msg: "", active: false });
  const [selectedFile, setSelectedFile] = React.useState({
    fileUrl: undefined,
    fileType: undefined,
    fileName: "",
  });
  const [messageData, setMessageData] = React.useState({
    receiver_id: -1,
    room_id: -1,
    message_content: "",
    message_file: undefined,
  });
  const paneRef = React.useRef();
  const bottomRef = React.useRef();

  const { room_code } = useParams();
  const token = localStorage.getItem("token");
  const messagePath = props.selectedRoom?.roomType === "direct" ? "dm" : "gm";
  const roomPath = props.selectedRoom?.roomType === "direct" ? "dr" : "gr";

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
      setErr({ msg: error.response.data.msg, active: true });
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
            receiver_id: data.receiver_id,
            room_id: data.room_id,
          };
        });
        fetchAllRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error.response.data.msg, active: true });
    }
  }, [room_code, token, url, roomPath, fetchAllRooms]);

  const uploadFile = async (e) => {
    e.preventDefault();
    const fileData = e.target.message_file.files[0];
    if (fileData.size > 10000000) {
      setErr({ msg: "File size is too large. Use less than 10MB.", active: true });
      setSending(false);
      return "Size error";
    }
    const formData = new FormData();
    formData.append("file", fileData);
    let fileLink = undefined;
    try {
      const { data } = await axios.post(`${url}/uf`, formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });
      fileLink = data.file_link;
      return fileLink;
    } catch (error) {
      console.log(error);
      setErr({ msg: error.response.data.msg, active: true });
      setSending(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    let fileLink = undefined;
    const { receiver_id, room_id, message_content, message_file } = messageData;
    if (textFns.isBlank(message_content) && !message_file) {
      setErr({ msg: "Enter a message first before sending.", active: true });
      return;
    }
    setSending(true);
    if (message_file) {
      fileLink = await uploadFile(e);
    }
    if (fileLink === "Size error") {
      return;
    }
    try {
      const { data } = await axios.post(
        `${url}/${messagePath}/room/${room_code}`,
        { receiver_id, room_id, message_content, message_file: fileLink ? fileLink : null },
        { headers: { Authorization: token } }
      );
      if (data) {
        setMessageData((prev) => {
          return {
            ...prev,
            message_content: "",
          };
        });
        socketSendMessage();
        fetchMessages();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error.response.data.msg, active: true });
      setSending(false);
    }
  };

  const filePreview = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile({ fileUrl: undefined, fileType: undefined, fileName: "" });
      return;
    }
    const url = URL.createObjectURL(e.target.files[0]);
    const type = e.target.files[0].type.split("/")[0];
    const name = e.target.files[0].name;
    setSelectedFile({ fileUrl: url, fileType: type, fileName: name });
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

  const selectMessage = (id) => {
    setSelectedMessage((prev) => (prev === id ? -1 : id));
  };

  const scrollIntoView = () => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleMessageData = ({ name, value }) => {
    setMessageData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const fetchOnScroll = () => {
    const el = paneRef.current;
    const pos = el.clientHeight + -el.scrollTop;
    if (Math.ceil(pos) >= el.scrollHeight) {
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
          <div ref={bottomRef} className="float-left clear-both" />
          {selectedFile.fileUrl && (
            <SelectedFile unselectFile={unselectFile} selectedFile={selectedFile} />
          )}
          {sending && <SendingMsg messageData={messageData} />}
          <ChatBar
            selectMessage={selectMessage}
            selectedMessage={selectedMessage}
            messages={messages}
          />
        </div>

        <form className="w-full cstm-flex gap-3" onSubmit={(e) => sendMessage(e)}>
          <IconInput
            name="message_file"
            id="message_file"
            value={messageData.message_file}
            onChange={(e) => {
              handleMessageData(e.target);
              filePreview(e);
            }}
          />

          <TextArea
            css="rounded-full"
            name="message_content"
            type="text"
            value={messageData.message_content}
            placeholder="enter message"
            id="message_content"
            onChange={(e) => handleMessageData(e.target)}
            required={false}
          />
          <button type="submit">
            <AiOutlineSend className="scale-[1.7] text-gr2" />
          </button>
        </form>
      </div>
    )
  );
}
