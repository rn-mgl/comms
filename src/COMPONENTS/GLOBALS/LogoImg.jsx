import React from "react";
import logoB from "../../IMG/comms logo.png";
import logoW from "../../IMG/comms logo white.png";
import { Link } from "react-router-dom";

export default function LogoImg() {
  const path = window.location.pathname;
  const logo = path.includes("auth/l") ? logoW : logoB;
  return (
    <Link
      to="/"
      className="absolute top-5 z-10
                t:left-5"
    >
      <img alt="logo" src={logo} className="w-20 l-l:w-32" />
    </Link>
  );
}
