import React from "react";

import Input from "../../COMPONENTS/INPUT/Input";
import Submit from "../../COMPONENTS/INPUT/Submit";
import Radio from "../../COMPONENTS/INPUT/Radio";

import { useGlobalContext } from "../../context";
import { AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";

import * as textFns from "../../FUNCTIONS/textFunc";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";

export default function MakeGroup(props) {
  const [groupData, setGroupData] = React.useState({ group_name: "", is_public: undefined });
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");

  const createRoom = async (e) => {
    e.preventDefault();
    const { group_name, is_public } = groupData;
    if (textFns.isEmpty(group_name)) {
      setErr({ msg: "Please enter an appropriate group name.", active: true });
      return;
    }
    try {
      const { data } = await axios.post(
        `${url}/gr`,
        { group_name, is_public },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.fetchAllRooms();
        props.handleCanMakeGroup();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanMakeGroup();
    }
  };

  const handleGroupData = ({ name, value }) => {
    setGroupData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="absolute backdrop-blur-sm w-full h-full z-20 left-0 top-0 cstm-flex"
    >
      <ErrMsg err={err} setErr={setErr} />
      <div
        className="h-min bg-gr1 p-2 rounded-md w-11/12 shadow-md cstm-flex flex-col gap-5
                    t:w-5/12
                    l-l:w-4/12"
      >
        <AiOutlineArrowLeft
          className="scale-125 cursor-pointer mr-auto"
          onClick={props.handleCanMakeGroup}
        />
        <form className="cstm-flex flex-col gap-3 w-full" onSubmit={(e) => createRoom(e)}>
          <Input
            name="group_name"
            type="text"
            value={groupData.group_name}
            placeholder="Enter group name"
            id="group_name"
            onChange={(e) => handleGroupData(e.target)}
            required={true}
          />
          <div className="font-head font-medium">Make group public?</div>
          <div className="cstm-flex gap-4">
            <Radio
              name="is_public"
              value={1}
              checked={groupData.is_public === "1"}
              id="true_public"
              onChange={(e) => handleGroupData(e.target)}
              label="Yes"
            />
            <Radio
              name="is_public"
              value={0}
              checked={groupData.is_public === "0"}
              id="false_public"
              onChange={(e) => handleGroupData(e.target)}
              label="No"
            />
          </div>

          <Submit css="bg-blk text-wht" label="Create" />
        </form>
      </div>
    </div>
  );
}
