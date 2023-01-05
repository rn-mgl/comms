import React from "react";

export default function Radio(props) {
  return (
    <label className="cstm-l-border font-head font-bold cursor-pointer">
      <input
        name={props.name}
        type="radio"
        value={props.value}
        checked={props.checked}
        id={props.id}
        onChange={props.onChange}
        className={`cstm-input hidden peer ${props.css}`}
      />
      <div
        className={`${props.css} peer-checked:bg-blk peer-checked:text-wht w-20 h-10 cstm-flex rounded-md`}
      >
        {props.label}
      </div>
    </label>
  );
}
