import React from "react";
import { Link } from "react-router-dom";

export default function LinkButton(props) {
  return (
    <Link
      className={`cstm-btn 
                ${props.css}`}
      to={props.path}
    >
      {props.label}
    </Link>
  );
}
