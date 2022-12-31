import React from "react";

export default function Submit(props) {
  return <input className={`cstm-btn ${props.css}`} type="submit" value={props.label} />;
}
