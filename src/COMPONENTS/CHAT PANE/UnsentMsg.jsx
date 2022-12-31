import React from "react";

export default function UnsentMsg(props) {
  return <div className="italic">{props.sender} unsent the message</div>;
}
