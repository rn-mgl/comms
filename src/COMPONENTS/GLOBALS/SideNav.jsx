import React from "react";
import { NavLink } from "react-router-dom";

export default function SideNav(props) {
  return (
    <div className="cstm-flex absolute z-10 translate-x-28 translate-y-12 bg-gr2 p-2 w-min rounded-md shadow-md">
      <NavLink className="cstm-nav-text cursor-pointer" onClick={props.logOut} to="/">
        <div className={`w-40 cstm-flex h-7 font-medium`}>Log Out</div>
      </NavLink>
    </div>
  );
}
