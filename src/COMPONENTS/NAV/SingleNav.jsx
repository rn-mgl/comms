import React from "react";
import { NavLink } from "react-router-dom";

export default function SingleNav(props) {
  return (
    <NavLink
      className={({ isActive }) => {
        return isActive ? "cstm-active-nav" : "cstm-nav-text";
      }}
      onClick={props.onClick}
      to={`/comms/${props.path}`}
    >
      <div className={`hidden t:cstm-flex group`}>
        {props.label}
        <div className="cstm-nav-hover-text">{props.subLabel}</div>
      </div>
      <div className={`t:hidden w-40 cstm-flex h-7 font-medium`}>{props.subLabel}</div>
    </NavLink>
  );
}
