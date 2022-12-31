import React from "react";

export default function Standby() {
  return (
    <div className="cstm-flex flex-col text-center gap-3 h-screen p-5">
      <div
        className="font-head font-bold text-lg cstm-gradient-2-3
                    l-l:text-2xl"
      >
        It may take a minute or two
      </div>
      <div
        className="font-body text-sm
                    l-l:text-lg"
      >
        Please wait for your account verification to be sent to your email. <br /> You can close
        this if you have received the e-mail.
      </div>
      <div className="cstm-flex animate-spin cstm-gbg-1-4 w-5 h-5 rounded-full">
        <div className="bg-white w-3 h-3 rounded-full" />
      </div>
    </div>
  );
}
