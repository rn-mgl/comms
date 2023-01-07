import React from "react";

import Radio from "../../COMPONENTS/INPUT/Radio";
import GroupRooms from "../../COMPONENTS/JOIN GROUP/GroupRooms";

import { AiOutlineArrowLeft } from "react-icons/ai";

export default function JoinGroup(props) {
  const [groupType, setGroupType] = React.useState("public");

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanJoinGroup();
    }
  };

  const handleGroupType = ({ value }) => {
    setGroupType(value);
  };

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="absolute left-0 top-0 w-full h-full backdrop-blur-sm z-20 cstm-flex"
    >
      <div
        className="w-11/12 h-4/6 bg-gr1 p-3 rounded-md shadow-md overflow-y-scroll cstm-scrollbar cstm-flex flex-col justify-start gap-3
                  t:w-6/12
                  l-s:w-5/12"
      >
        <AiOutlineArrowLeft
          onClick={props.handleCanJoinGroup}
          className="scale-125 mr-auto cursor-pointer"
        />
        <div className="cstm-flex gap-4">
          <Radio
            name="is_public"
            value="public"
            checked={groupType === "public"}
            id="true_public"
            onChange={(e) => handleGroupType(e.target)}
            label="Public"
          />
          <Radio
            name="is_public"
            value="private"
            checked={groupType === "private"}
            id="false_public"
            onChange={(e) => handleGroupType(e.target)}
            label="Private"
          />
        </div>
        <GroupRooms groupType={groupType} fetchAllRooms={props.fetchAllRooms} />
      </div>
    </div>
  );
}
