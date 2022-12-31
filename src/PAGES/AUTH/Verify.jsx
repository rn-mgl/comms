import React from "react";

import LogoImg from "../../COMPONENTS/GLOBALS/LogoImg";
import LinkButton from "../../COMPONENTS/INPUT/LinkButton";

import axios from "axios";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";

export default function Verify() {
  const { token } = useParams();
  const { url } = useGlobalContext();

  const verifyUser = React.useCallback(async () => {
    try {
      const { data } = await axios.patch(`${url}/auth/verification/${token}`, { is_confirmed: 1 });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }, [token, url]);

  React.useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return (
    <div className="cstm-flex flex-col gap-3 text-center h-screen cstm-gbg-1-2 p-5">
      <LogoImg />
      <div>
        <div
          className="font-head font-bold text-xl
                      t:text-2xl"
        >
          Welcome!
        </div>
        <div
          className="font-body text-sm
                      t:text-lg"
        >
          You are now a verified user.
        </div>
      </div>
      <div
        className="cstm-flex flex-col gap-3 w-6/12
                  t:flex-row-reverse
                  l-s:w-4/12"
      >
        <LinkButton css="bg-blk text-wht" path="/auth/l" label="Log In" />
        <LinkButton css="bg-wht text-blk" path="/" label="Home" />
      </div>
    </div>
  );
}
