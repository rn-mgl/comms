import React from "react";

import Blocked from "../../COMPONENTS/MY PROFILE/Blocked";
import ReceivedRequests from "../../COMPONENTS/MY PROFILE/ReceivedRequests";
import SentRequests from "../../COMPONENTS/MY PROFILE/SentRequests";
import UserData from "../../COMPONENTS/MY PROFILE/UserData";

export default function MyProfile() {
  return (
    <div
      className="p-2 cstm-flex flex-col gap-3 
                t:w-10/12 t:mx-auto
                l-s:w-8/12"
    >
      <UserData />
      <SentRequests />
      <ReceivedRequests />
      <Blocked />
    </div>
  );
}
