import React from "react";
import LogoImg from "../../COMPONENTS/GLOBALS/LogoImg";
import LoginGraphic from "../../COMPONENTS/AUTH/LoginGraphic";

import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import axios from "axios";
import * as textFns from "../../FUNCTIONS/textFunc";

import Input from "../../COMPONENTS/INPUT/Input";
import Submit from "../../COMPONENTS/INPUT/Submit";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";

export default function Login() {
  const { url, socket } = useGlobalContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const [login, setLogin] = React.useState({
    email: "",
    password: "",
  });
  const [err, setErr] = React.useState({ msg: "", active: false });

  const socketLogin = () => {
    socket.emit("login", { msg: "logged in" });
  };

  const handleLoginCreds = ({ name, value }) => {
    setLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const logIn = async (e) => {
    e.preventDefault();
    const { email, password } = login;
    if (textFns.isEmpty(email) || textFns.isBlank(password)) {
      setErr({ msg: "Please fill in the required fields.", active: true });
      return;
    }
    try {
      const { data } = await axios.get(`${url}/auth`, {
        params: {
          candidate_email: email,
          candidate_password: password,
        },
      });

      if (data) {
        localStorage.setItem("token", `Bearer ${data.token}`);
        localStorage.setItem("user", data.user.id);
        localStorage.setItem("name", data.user.name);
        socketLogin();
        navigate("/comms/ar");
      } else {
        setErr({ msg: "The email and password does not match", active: true });
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  React.useEffect(() => {
    if (token && token.startsWith("Bearer ") && user && user.toLowerCase() === user.toUpperCase()) {
      navigate("/comms/ar");
    }
  }, [navigate, token, user]);

  return (
    <div
      className="cstm-flex flex-col
                t:flex-row"
    >
      <ErrMsg err={err} setErr={setErr} />
      <LogoImg />
      <LoginGraphic />
      <form
        onSubmit={(e) => logIn(e)}
        className="cstm-flex gap-3 flex-col h-80 w-10/12
                   t:w-6/12 t:static t:h-screen"
      >
        <div
          className="cstm-flex gap-3 flex-col w-10/12
                    l-l:w-8/12"
        >
          <Input
            name="email"
            value={login.email}
            placeholder="e-mail*"
            type="text"
            id="email"
            onChange={(e) => handleLoginCreds(e.target)}
          />
          <Input
            name="password"
            value={login.password}
            placeholder="password*"
            type="password"
            id="password"
            onChange={(e) => handleLoginCreds(e.target)}
          />
          <Submit label="Log In" css="bg-blk text-wht" />
        </div>
      </form>
    </div>
  );
}
