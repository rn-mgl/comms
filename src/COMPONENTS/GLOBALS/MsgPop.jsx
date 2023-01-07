import React from "react";

export default function MsgPop({ msg, setMsg }) {
  if (msg.active) {
    setTimeout(() => {
      setMsg({ msg: "", active: false });
    }, 5000);
  }

  return (
    msg.active && (
      <div
        className={`bg-gr3 p-4 font-head font-medium rounded-md text-emerald-300 fixed text-sm
            transition-all z-50 w-72 top-3 left-2/4 -translate-x-2/4 text-center ${
              msg.active ? "translate-y-1" : "-translate-y-20"
            }`}
      >
        {msg.msg}
      </div>
    )
  );
}
