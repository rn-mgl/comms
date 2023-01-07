import axios from "axios";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useGlobalContext } from "../../context";
import Button from "../INPUT/Button";

export default function Members(props) {
  const [members, setMembers] = React.useState([]);

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");
  const user = parseInt(localStorage.getItem("user"));
  const isAdmin = props.roomData?.is_admin;

  const fetchAllMembers = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/gr/mnl/${props.roomData?.room_code}`, {
        headers: { Authorization: token },
      });
      if (data) {
        setMembers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, url, props.roomData?.room_code]);

  const removeMember = async (member_id) => {
    try {
      const { data } = await axios.patch(
        `${url}/gr/${props.roomData?.room_code}`,
        { member_id },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchAllMembers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanSeeMembers();
    }
  };

  React.useEffect(() => {
    fetchAllMembers();
  }, [fetchAllMembers]);

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className="fixed cstm-flex top-0 left-0 z-20 backdrop-blur-sm w-full h-full"
    >
      <div
        className="w-11/12 h-5/6 bg-gr1 rounded-md p-2 cstm-flex justify-start flex-col gap-2 shadow-md
                    t:w-6/12"
      >
        <AiOutlineArrowLeft
          onClick={props.handleCanSeeMembers}
          className="mr-auto scale-125 cursor-pointer"
        />
        {members.map((member) => {
          return (
            <div
              key={member.user_id}
              className={`${
                member.is_admin ? "bg-blk" : "bg-gr3"
              } w-full p-2 rounded-md text-wht cstm-flex justify-start gap-2`}
            >
              <div
                className="w-11 h-11 rounded-full cstm-gbg-1-2 bg-cover bg-center"
                style={{ backgroundImage: member.image && `url(${member.image})` }}
              />
              <div className="truncate mr-auto">
                <div className="font-head font-medium">
                  {member.name} {member.is_admin ? " | admin" : null}
                </div>
                <div className="font-body text-xs font-light">{member.email}</div>
              </div>
              {isAdmin && user !== member.user_id ? (
                <Button
                  onClick={() => removeMember(member.user_id)}
                  label="Axe"
                  css="w-min bg-gr1 text-blk text-xs"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
