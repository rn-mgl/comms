import React from "react";
import SignupGraphics from "../../COMPONENTS/AUTH/SignupGraphics";
import LogoImg from "../../COMPONENTS/GLOBALS/LogoImg";

import Input from "../../COMPONENTS/INPUT/Input";
import Submit from "../../COMPONENTS/INPUT/Submit";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import * as textFns from "../../FUNCTIONS/textFunc";

export default function Signup() {
  const { url } = useGlobalContext();
  const navigate = useNavigate();
  const [err, setErr] = React.useState({
    msg: "",
    active: false,
  });
  const [signUp, setSignUp] = React.useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    in_comms_name: "",
  });

  const handleSignUpCreds = ({ name, value }) => {
    setSignUp((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const signUser = async (e) => {
    e.preventDefault();
    const { name, surname, email, password, in_comms_name } = signUp;
    if (
      textFns.isEmpty(name) ||
      textFns.isEmpty(surname) ||
      textFns.isEmpty(email) ||
      textFns.isBlank(password)
    ) {
      setErr({ msg: "Please fill out the required fields.", active: true });
      return;
    }
    try {
      const { data } = await axios.post(`${url}/auth`, {
        name,
        surname,
        email,
        password,
        in_comms_name: textFns.isEmpty(in_comms_name) ? null : in_comms_name,
      });

      if (data) {
        localStorage.setItem("token", `Bearer ${data.token}`);
        localStorage.setItem("user", data.user.id);
        navigate("/auth/sb");
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  return (
    <div
      className="cstm-flex flex-col
                t:flex-row-reverse"
    >
      <ErrMsg err={err} setErr={setErr} />
      <LogoImg />
      <SignupGraphics />
      <form
        onSubmit={(e) => signUser(e)}
        className="cstm-flex gap-3 flex-col h-80 w-10/12 justify-start
                   t:w-6/12 t:static t:h-screen t:justify-center"
      >
        <div
          className="cstm-flex gap-3 flex-col w-10/12 my-5
                    l-l:w-8/12"
        >
          <Input
            name="name"
            value={signUp.name}
            placeholder="name*"
            type="text"
            id="name"
            onChange={(e) => handleSignUpCreds(e.target)}
          />
          <Input
            name="surname"
            value={signUp.surname}
            placeholder="surname*"
            type="text"
            id="surname"
            onChange={(e) => handleSignUpCreds(e.target)}
          />
          <Input
            name="email"
            value={signUp.email}
            placeholder="e-mail*"
            type="text"
            id="email"
            onChange={(e) => handleSignUpCreds(e.target)}
          />
          <Input
            name="password"
            value={signUp.password}
            placeholder="password*"
            type="password"
            id="password"
            onChange={(e) => handleSignUpCreds(e.target)}
          />
          <Input
            name="in_comms_name"
            value={signUp.in_comms_name}
            placeholder="username"
            type="text"
            id="in_comms_name"
            onChange={(e) => handleSignUpCreds(e.target)}
          />
          <Submit label="Log In" css="bg-blk text-wht" />
        </div>
      </form>
    </div>
  );
}
