import React from "react";

import IconInput from "../INPUT/IconInput";
import TextArea from "../INPUT/TextArea";
import Unavailable from "./Unavailable";

import { AiOutlineSend } from "react-icons/ai";

import * as fileFns from "../../FUNCTIONS/fileFunc";

export default function MessageInput(props) {
  return props.isBlocked ? (
    <Unavailable />
  ) : (
    <form className="w-full cstm-flex gap-3" onSubmit={(e) => props.sendMessage(e)}>
      <IconInput
        name="message_file"
        id="message_file"
        value={props.messageData.message_file}
        onChange={(e) => {
          props.handleMessageData(e.target);
          fileFns.filePreview(e.target.files[0], props.setSelectedFile);
        }}
      />

      <TextArea
        css="rounded-full"
        name="message_content"
        type="text"
        value={props.messageData.message_content}
        placeholder="enter message"
        id="message_content"
        onChange={(e) => props.handleMessageData(e.target)}
        required={false}
      />
      <button type="submit">
        <AiOutlineSend className="scale-[1.7] text-gr2" />
      </button>
    </form>
  );
}
