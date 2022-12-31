import React from "react";

export default function LoginGraphic() {
  return (
    <div
      className="cstm-flex flex-col cstm-gbg-2-3 w-full p-3 text-wht h-80
                t:static t:w-6/12 t:h-screen"
    >
      <div
        className="font-head font-bold text-lg
                  t:text-2xl
                  l-s:text-3xl
                  l-l:text-4xl"
      >
        Welcome!
      </div>
      <div
        className="font-body text-sm
                  t:text-base
                  l-l:text-lg"
      >
        enter your e-mail and password to enter
      </div>
    </div>
  );
}
