import React from "react";

export default function TextArea(props) {
  return (
    <textarea
      name={props.name}
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      id={props.id}
      onChange={props.onChange}
      required={props.required}
      autoComplete="true"
      className={`cstm-input scrollbar-none resize-none ${props.css}`}
      rows={1}
    />
  );
}
