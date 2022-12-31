import React from "react";

export default function Input(props) {
  return (
    <input
      name={props.name}
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      id={props.id}
      onChange={props.onChange}
      required={props.required}
      autoComplete="true"
      className={`cstm-input ${props.css}`}
    />
  );
}
