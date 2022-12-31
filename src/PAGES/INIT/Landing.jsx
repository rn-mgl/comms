import React from "react";
import landing from "../../IMG/comms landing.png";
import LinkButton from "../../COMPONENTS/INPUT/LinkButton";
import LogoImg from "../../COMPONENTS/GLOBALS/LogoImg";

export default function Landing() {
  return (
    <div className="cstm-flex ">
      <LogoImg />
      <div
        className="cstm-flex flex-col h-auto p-5 cstm-center-abs gap-5 w-full
              l-s:flex-row"
      >
        <div
          className="text-center w-full cstm-flex flex-col gap-3 
                t:gap-5
                l-s:w-7/12
                l-l:w-8/12"
        >
          <div
            className="font-head font-bold text-xl text-blk text-center w-full mx-auto
                      t:text-5xl t:justify-start t:w-11/12
                      l-s:w-full l-s:text-6xl l-s:text-left
                      l-l:text-7xl"
          >
            connect instantly, communicate freely, and keep in touch securely
          </div>
          <div
            className="font-body text-xs w-full
                    t:text-base 
                    l-s:text-left l-s:text-base
                    l-l:text-lg"
          >
            a place to talk, have fun, and express freely
          </div>
          <div
            className="cstm-flex flex-col w-full gap-3
                  t:w-80
                  l-s:w-8/12 l-s:mr-auto l-s:flex-row"
          >
            <LinkButton css="bg-blk text-wht" path="/auth/l" label="Log In" />
            <LinkButton css="bg-wht text-blk" path="/auth/s" label="Sign Up" />
          </div>
        </div>

        <div
          className="cstm-flex w-full 
                m-l:w-10/12
                t:w-5/12
                l-l:w-4/12"
        >
          <img alt="landing" src={landing} className="w-full" />
        </div>
      </div>
    </div>
  );
}
