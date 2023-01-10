import React from "react";

export default function GroupOptions(props) {
  return (
    <div
      className="cstm-flex flex-col text-center gap-1 absolute top-0 z-10 translate-x-11 translate-y-12 p-2 
                 rounded-md bg-gr2 shadow-md text-wht font-head text-sm
                 m-m:translate-x-3
                 m-l:-translate-x-3
                 t:translate-x-24"
    >
      <div className="cstm-chat-options cursor-pointer" onClick={props.handleCanSeeMembers}>
        Members
      </div>
      <div className="cstm-divider my-0 bg-wht w-full" />
      {props.roomData?.is_admin ? (
        <>
          <div className="cstm-chat-options cursor-pointer" onClick={props.handleCanAddMember}>
            Add Member
          </div>
          <div className="cstm-divider my-0 bg-wht w-full" />
        </>
      ) : null}

      <div className="cstm-chat-options cursor-pointer" onClick={props.handleCanSendJoinRequests}>
        Send Join Request
      </div>

      {props.roomData?.is_admin ? (
        <>
          <div className="cstm-divider my-0 bg-wht w-full" />
          <div className="cstm-chat-options cursor-pointer" onClick={props.handleCanDeleteGroup}>
            Delete Group
          </div>
        </>
      ) : null}

      <>
        <div className="cstm-divider my-0 bg-wht w-full" />
        <div className="cstm-chat-options cursor-pointer" onClick={props.handleCanUpdateGroup}>
          Manage Group
        </div>
      </>
    </div>
  );
}
