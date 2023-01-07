import axios from "axios";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useGlobalContext } from "../../context";
import Button from "../INPUT/Button";

export default function AddMember(props) {
  const [friends, setFriends] = React.useState([]);

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");

  const fetchFriends = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/user/mnl/user`, {
        params: { room_code: props.roomData?.room_code },
        headers: { Authorization: token },
      });
      if (data) {
        setFriends(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, token, props.roomData?.room_code]);

  const addMember = async (member_id) => {
    try {
      const { data } = await axios.post(
        `${url}/gr/${props.roomData?.room_code}`,
        {
          member_id,
          theme: props.roomData?.theme,
          group_name: props.roomData?.room_name,
        },
        { headers: { Authorization: token } }
      );

      if (data) {
        fetchFriends();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanAddMember();
    }
  };

  React.useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

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
          onClick={props.handleCanAddMember}
          className="mr-auto scale-125 cursor-pointer"
        />
        {friends.map((friend) => {
          return (
            <div
              key={friend.user_id}
              className="bg-gr3 w-full p-2 rounded-md text-wht cstm-flex justify-start gap-2"
            >
              <div
                className="w-11 h-11 rounded-full cstm-gbg-1-2 bg-cover bg-center"
                style={{ backgroundImage: friend.image && `url(${friend.image})` }}
              />
              <div className="truncate mr-auto">
                <div className="font-head font-medium">{friend.name}</div>
                <div className="font-body text-xs font-light">{friend.email}</div>
              </div>
              <Button
                onClick={() => addMember(friend.user_id)}
                css="bg-gr1 w-min text-blk"
                label="Add"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
