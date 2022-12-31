import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function FileViewer(props) {
  const type = props.file.split("/")[4];
  const isAudio = props.file.endsWith(".mp3");
  return (
    <div
      className="shadow-md mr-auto rounded-md border-4 border-wht bg-wht text-center text-xs font-light font-head opacity-90
                t:text-sm"
    >
      {type === "image" ? (
        <img className="rounded-md w-full cstm-l-border" src={props.file} alt="selected msg" />
      ) : type === "video" && !isAudio ? (
        <video
          controls={true}
          className="rounded-md cstm-l-border"
          src={props.file}
          alt="selected msg"
        />
      ) : isAudio ? (
        <audio
          controls={true}
          className="rounded-md cstm-l-border w-44 bg-gr1
                        m-m:w-56 
                        m-l:w-64"
          src={props.file}
          alt="selected msg"
        />
      ) : (
        <iframe
          className="rounded-md cstm-l-border"
          src={props.file}
          title={props.file}
          alt="selected msg"
        />
      )}
      <a
        href={props.file}
        target="_blank"
        rel="noreferrer"
        className="text-blk cstm-flex gap-2 hover:underline p-2"
      >
        go to file
        <AiOutlineArrowRight />
      </a>
    </div>
  );
}
