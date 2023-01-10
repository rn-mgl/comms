import React from "react";

import axios from "axios";
import * as fileFns from "../../FUNCTIONS/fileFunc";
import * as textFns from "../../FUNCTIONS/textFunc";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";
import { AiOutlineArrowLeft } from "react-icons/ai";

import Input from "../INPUT/Input";
import SelectedFile from "../CHAT PANE/SelectedFile";
import IconInput from "../INPUT/IconInput";
import Radio from "../INPUT/Radio";
import Submit from "../INPUT/Submit";
import Button from "../INPUT/Button";
import FileViewer from "../CHAT BAR/FileViewer";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function UpdateGroup(props) {
  const [roomData, setRoomData] = React.useState({
    group_name: "",
    is_public: undefined,
    group_image: undefined,
  });
  const [selectedFile, setSelectedFile] = React.useState({
    fileUrl: undefined,
    fileName: undefined,
    fileType: undefined,
  });
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url, socket } = useGlobalContext();
  const { room_code } = useParams();
  const token = localStorage.getItem("token");

  const fetchRoomData = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/gr/${room_code}`, {
        headers: { Authorization: token },
      });

      if (data) {
        setRoomData({
          group_name: data.room_name,
          is_public: data.is_public,
          group_image: data.room_image,
        });
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [url, token, room_code]);

  const updateGroup = async (e) => {
    e.preventDefault();

    const { group_name, group_image, is_public } = roomData;
    if (textFns.isEmpty(group_name)) {
      setErr({ msg: "Fill out the required fields before updating.", active: true });
      return;
    }
    let fileLink = undefined;

    if (group_image) {
      fileLink = await fileFns.uploadFile(e.target.group_image.files[0], url, setSelectedFile);
    }

    try {
      const { data } = await axios.patch(
        `${url}/gr/mnl/${room_code}`,
        {
          group_name,
          group_image: fileLink
            ? fileLink
            : group_image && fileFns.isLink(group_image)
            ? group_image
            : null,
          is_public,
        },
        { headers: { Authorization: token } }
      );

      if (data) {
        props.handleCanUpdateGroup();
        props.fetchRoomData();
        setSelectedFile({
          fileUrl: undefined,
          fileName: undefined,
          fileType: undefined,
        });
        socketUpdateRoom();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const socketReflectUpdateRoom = React.useCallback(() => {
    socket.on("reflect-update-room", () => {
      fetchRoomData();
    });
  }, [fetchRoomData, socket]);

  const handleRoomData = ({ name, value }) => {
    setRoomData((prev) => {
      return {
        ...prev,
        [name]: name === "is_public" ? parseInt(value) : value,
      };
    });
  };

  const removeFile = () => {
    setRoomData((prev) => {
      return {
        ...prev,
        group_image: undefined,
      };
    });

    setSelectedFile({
      fileUrl: undefined,
      fileName: undefined,
      fileType: undefined,
    });

    setRoomData((prev) => {
      return {
        ...prev,
        group_image: undefined,
      };
    });
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanUpdateGroup();
    }
  };

  const socketUpdateRoom = () => {
    socket.emit("update-room", { msg: "room update" });
  };

  React.useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData]);

  React.useEffect(() => {
    socketReflectUpdateRoom();
  }, [socketReflectUpdateRoom]);

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="fixed cstm-flex top-0 left-0 z-20 backdrop-blur-sm w-full h-full"
    >
      <ErrMsg err={err} setErr={setErr} />
      <div
        className="w-11/12 h-min bg-gr1 rounded-md p-2 cstm-flex justify-start flex-col gap-2 shadow-md
                t:w-6/12"
      >
        <AiOutlineArrowLeft
          onClick={props.handleCanUpdateGroup}
          className="mr-auto scale-125 cursor-pointer"
        />
        <form onSubmit={(e) => updateGroup(e)} className="cstm-flex flex-col gap-3 w-full">
          <Input
            name="group_name"
            type="text"
            value={roomData.group_name}
            placeholder="Group Name"
            id="group_name"
            onChange={(e) => handleRoomData(e.target)}
            required={true}
          />
          <div className="cstm-flex gap-2">
            <Radio
              name="is_public"
              value={1}
              id="is_public_yes"
              checked={roomData.is_public === 1}
              onChange={(e) => handleRoomData(e.target)}
              label="Yes"
            />
            <Radio
              name="is_public"
              value={0}
              id="is_public_no"
              checked={roomData.is_public === 0}
              onChange={(e) => handleRoomData(e.target)}
              label="No"
            />
          </div>

          {selectedFile.fileUrl ? (
            <SelectedFile removeFile={removeFile} css="mx-auto" selectedFile={selectedFile} />
          ) : roomData.group_image && fileFns.isLink(roomData.group_image) ? (
            <>
              <FileViewer file={roomData.group_image} />
              <div className="font-body text-sm font-light">Current Image</div>
            </>
          ) : null}

          <IconInput
            name="group_image"
            id="group_image"
            value={selectedFile.fileUrl ? selectedFile.fileUrl : roomData.group_image}
            onChange={(e) => {
              handleRoomData(e.target);
              fileFns.filePreview(e.target.files[0], setSelectedFile);
            }}
          />

          {selectedFile.fileUrl || roomData.group_image ? (
            <Button onClick={removeFile} css="bg-gr2 text-wht" label="Remove File" />
          ) : null}

          <Submit value="Update" css="bg-blk text-wht" />
        </form>
      </div>
    </div>
  );
}
