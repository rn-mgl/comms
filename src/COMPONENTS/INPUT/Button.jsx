import React from "react";

export default function Button(props) {
  return (
    <button onClick={props.onClick} className={`${props.css} w-full cstm-btn`}>
      {props.label}
    </button>
  );
}
