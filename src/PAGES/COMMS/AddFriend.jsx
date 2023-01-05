import React from "react";

import axios from "axios";
import Button from "../../COMPONENTS/INPUT/Button";
import Input from "../../COMPONENTS/INPUT/Input";
import ErrMsg from "../../COMPONENTS/GLOBALS/ErrMsg";

import { useGlobalContext } from "../../context";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function AddFriend(props) {
  const { url } = useGlobalContext();
  const [word, setWord] = React.useState("");
  const [allUsers, setAllUsers] = React.useState([]);
  const [matchingUsers, setMatchingUsers] = React.useState([]);
  const [err, setErr] = React.useState({ msg: "", active: false });

  const token = localStorage.getItem("token");

  const fetchAllUsers = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/user`, { headers: { Authorization: token } });
      if (data) {
        setAllUsers(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url]);

  const addFriendRequest = async (id) => {
    try {
      const { data } = await axios.post(
        `${url}/drreq`,
        { request_to: id },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchAllUsers();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleInput = ({ value }) => {
    setWord(value);
  };

  const displayUsers = React.useCallback(() => {
    setMatchingUsers(
      allUsers.filter((user) => user.name?.includes(word) || user.email?.includes(word))
    );
  }, [allUsers, word]);

  React.useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  React.useEffect(() => {
    displayUsers();
  }, [displayUsers]);

  return (
    <div className="fixed backdrop-blur-sm w-full h-full z-20 cstm-flex left-0 top-0">
      <ErrMsg err={err} setErr={setErr} />
      <div
        className="w-11/12 h-5/6 bg-gr1 rounded-md shadow-md cstm-l-border p-5 cstm-flex flex-col justify-start gap-3 overflow-y-auto cstm-scrollbar
                  t:w-6/12 t:h-4/6"
      >
        <div className="cstm-flex mb-5 gap-3 w-full">
          <AiOutlineArrowLeft
            className="scale-125 cursor-pointer"
            onClick={props.handleCanAddFriend}
          />
          <Input
            css="romapunded-full "
            placeholder="search name or e-mail"
            onChange={(e) => handleInput(e.target)}
          />
        </div>

        {matchingUsers.map((match) => {
          const email = match.email?.length > 15 ? `${match.email.slice(0, 15)}...` : match.email;
          const name = match.name?.length > 15 ? `${match.name.slice(0, 15)}...` : match.name;

          return (
            <div
              key={match.user_id}
              className="cstm-flex flex-col w-full bg-blk p-2 rounded-md text-wht gap-3"
            >
              <div className="cstm-flex gap-3 justify-start w-full">
                <div
                  className="w-10 h-10 bg-cover rounded-full bg-center cstm-gbg-1-3"
                  style={{ backgroundImage: match.image ? `url(${match.image})` : null }}
                />
                <div className="truncate">
                  <div className="font-head font-medium">{email}</div>
                  <div className="font-body text-sm font-light">{name}</div>
                </div>
              </div>
              <Button
                css="bg-gr1 text-blk"
                onClick={() => addFriendRequest(match.user_id)}
                label="Add Friend"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
