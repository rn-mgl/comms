import React from "react";
import { AiOutlineUpload } from "react-icons/ai";

export default function IconInput(props) {
  return (
    <>
      <label htmlFor={props.name}>
        <AiOutlineUpload className="p-0.5 scale-[1.7] cursor-pointer hover:bg-gr1 rounded-md" />
      </label>
      <input
        type="file"
        name={props.name}
        id={props.id}
        defaultValue={props.value}
        onChange={props.onChange}
        required={props.required}
        className="hidden"
      />
    </>
  );
}
