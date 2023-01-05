import React from "react";

export default function ErrMsg({ err, setErr }) {
  if (err.active) {
    setTimeout(() => {
      setErr({ msg: "", active: false });
    }, [5000]);
  }

  return (
    err.active && (
      <div
        className={`bg-gr3 p-4 font-head font-medium rounded-md text-red-500 absolute 
                  transition-all z-20 w-60 top-3 left-2/4 -translate-x-2/4 text-center ${
                    err.active ? "translate-y-2" : "-translate-y-52"
                  }`}
      >
        {err.msg.response?.data?.msg
          ? err.msg.response?.data?.msg
          : err.msg.message
          ? err.msg.message
          : err.msg}
      </div>
    )
  );
}
