import React from "react";

import logo from "../../IMG/comms logo.png";

import { AiOutlineCloseCircle } from "react-icons/ai";

export default function SelectedFile(props) {
  const type = props.selectedFile.fileType;

  return (
    <div
      className={`${type === "audio" ? "w-full t:w-72" : "w-36"} ${
        props.css
      } shadow-md mr-auto rounded-md border-4 border-wht bg-wht text-center text-xs font-light font-head opacity-90`}
    >
      <AiOutlineCloseCircle
        onClick={props.removeFile}
        className="ml-auto m-2 scale-110 cursor-pointer"
      />
      {type === "image" ? (
        <img
          className="rounded-md w-full cstm-l-border"
          src={props.selectedFile.fileUrl}
          alt="selected msg"
        />
      ) : type === "video" ? (
        <video
          controls={true}
          className="rounded-md cstm-l-border"
          src={props.selectedFile.fileUrl}
          alt="selected msg"
        />
      ) : type === "audio" ? (
        <audio className="w-full h-4" src={props.selectedFile.fileUrl} controls={true} />
      ) : (
        <>
          <img className="rounded-md cstm-l-border" src={logo} alt="selected msg" />
          <div className="font-medium text-sm">{props.selectedFile.fileName}</div>
        </>
      )}
      file preview
    </div>
  );
}
