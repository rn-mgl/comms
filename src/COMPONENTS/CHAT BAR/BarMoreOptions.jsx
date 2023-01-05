import React from "react";

export default function BarMoreOptions(props) {
  return (
    <div
      className={`${
        props.isSender ? "order-1 bg-blk text-wht" : "order-3 bg-wht text-blk"
      } cstm-flex flex-col gap-1 w-28 text-center rounded-md p-2 font-body text-sm`}
    >
      <div
        onClick={() => {
          props.handleReplyTo();
          props.selectMessage(-1);
          props.handleBarMoreOptions(-1);
        }}
        className="cstm-chat-options"
      >
        Reply
      </div>
      {/* <div className="cstm-chat-options" onClick={props.deleteMessage}>
        Hide
      </div> */}
      {props.isSender && (
        <div
          className="cstm-chat-options"
          onClick={() => {
            props.unsendMessage();
            props.selectMessage(-1);
            props.handleBarMoreOptions(-1);
          }}
        >
          Unsend
        </div>
      )}
    </div>
  );
}
