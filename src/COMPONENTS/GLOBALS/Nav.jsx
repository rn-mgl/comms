import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import logo from "../../IMG/comms logo white.png";
import SideNav from "./SideNav";
import axios from "axios";
import { useGlobalContext } from "../../context";

export default function Nav() {
  const { url, socket } = useGlobalContext();
  const [showNav, setShowNav] = React.useState(false);

  const token = localStorage.getItem("token");

  const handleShowNav = () => {
    setShowNav((prev) => !prev);
  };

  const socketLogout = () => {
    socket.emit("logout", { msg: "logged out" });
  };

  const logOut = async () => {
    try {
      const { data } = await axios.patch(
        `${url}/user/logout`,
        { is_active: 0 },
        { headers: { Authorization: token } }
      );
      if (data) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("roomId");
        localStorage.removeItem("roomType");
        localStorage.removeItem("roomFrom");
        socketLogout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const MenuIcon = showNav ? AiOutlineClose : AiOutlineMenu;

  return (
    <>
      <div className="p-8 bg-blk cstm-flex w-screen">
        <div className="cstm-flex absolute left-0">
          <MenuIcon
            color="white"
            className="left-5 absolute mr-auto scale-150 hover:cursor-pointer z-20"
            onClick={handleShowNav}
          />
          {showNav && <SideNav logOut={logOut} />}
        </div>

        <div
          className={`${
            showNav ? "flex" : "hidden"
          }         cstm-flex bg-blk absolute gap-10 flex-col cstm-center-abs h-screen w-screen z-10
                    t:flex t:flex-row t:h-auto t:top-8 t:bg-none t:w-min`}
        >
          <NavLink
            className={({ isActive }) => {
              return isActive ? "cstm-active-nav" : "cstm-nav-text";
            }}
            to="/comms/ar"
          >
            <div className={`hidden t:cstm-flex group`}>
              AR
              <div className="cstm-nav-hover-text">All Rooms</div>
            </div>
            <div className={`t:hidden w-40 cstm-flex h-7 font-medium`}>All Rooms</div>
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "cstm-active-nav" : "cstm-nav-text";
            }}
            to="/comms/dr"
          >
            <div className={`hidden t:cstm-flex group`}>
              DR<div className="cstm-nav-hover-text">Direct Rooms</div>
            </div>
            <div className={`t:hidden w-40 cstm-flex h-7 font-medium`}>Direct Rooms</div>
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "cstm-active-nav" : "cstm-nav-text";
            }}
            to="/comms/gr"
          >
            <div className={`hidden t:cstm-flex group`}>
              GR<div className="cstm-nav-hover-text">Group Rooms</div>
            </div>
            <div className={`t:hidden w-40 cstm-flex h-7 font-medium`}>Group Rooms</div>
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "cstm-active-nav" : "cstm-nav-text";
            }}
            to="/comms/mp"
          >
            <div className={`hidden t:cstm-flex group`}>
              MP<div className="cstm-nav-hover-text">My Profile</div>
            </div>
            <div className={`t:hidden w-40 cstm-flex h-7 font-medium`}>My Profile</div>
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return isActive ? "cstm-active-nav t:hidden" : "cstm-nav-text t:hidden";
            }}
            onClick={logOut}
            to="/"
          >
            <div className={`w-40 cstm-flex h-7 font-medium`}>Log Out</div>
          </NavLink>
        </div>
        <NavLink className="right-5 absolute w-20 z-20" to="/comms/ar">
          <img alt="logo" src={logo} />
        </NavLink>
      </div>

      <Outlet />
    </>
  );
}
