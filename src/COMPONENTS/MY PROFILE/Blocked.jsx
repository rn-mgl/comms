import React from "react";

import { useGlobalContext } from "../../context";
import axios from "axios";

import Button from "../INPUT/Button";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function Blocked() {
  const [rooms, setRooms] = React.useState([]);
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");

  const fetchAllBlockedRooms = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/dr/blck/rm`, { headers: { Authorization: token } });
      if (data) {
        setRooms(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url]);

  const unblockRoom = async (room_code) => {
    try {
      const { data } = await axios.patch(
        `${url}/dr/blck/rm`,
        { room_code },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchAllBlockedRooms();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  React.useEffect(() => {
    fetchAllBlockedRooms();
  }, [fetchAllBlockedRooms]);

  return (
    <div className="cstm-flex justify-start flex-col gap-3 bg-gr3 p-2 w-full rounded-md overflow-y-auto cstm-scrollbar h-64 scrollbar-thumb-gr2">
      <ErrMsg err={err} setErr={setErr} />
      <div className="font-head text-wht font-semibold">Blocked Rooms</div>
      {rooms.map((room) => {
        return (
          <div
            key={room.room_id}
            className="w-full cstm-flex justify-start gap-3 p-2 bg-wht rounded-md"
          >
            <div className="w-10 h-10 rounded-full cstm-gbg-1-3" />
            <div className="truncate mr-auto w-5/12">
              <div className="font-head font-medium text-sm">{room.room_name}</div>
              {/* <div className="font-body font-light text-sm">{request.request_to_email}</div> */}
            </div>
            <Button
              onClick={() => unblockRoom(room.room_code)}
              css="w-min text-xs bg-blk text-wht"
              label="Unblock"
            />
          </div>
        );
      })}
    </div>
  );
}
