import React from "react";

import axios from "axios";
import { useGlobalContext } from "../../context";

import Button from "../INPUT/Button";
import Radio from "../INPUT/Radio";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function SentRequests() {
  const [requests, setRequests] = React.useState([]);
  const [sentPath, setSentPath] = React.useState("drreq");
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url, socket } = useGlobalContext();
  const token = localStorage.getItem("token");

  const fetchSentRequests = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/${sentPath}`, {
        params: { request_type: "sent" },
        headers: { Authorization: token },
      });
      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, sentPath]);

  const cancelRequests = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/${sentPath}/${id}`, {
        headers: { Authorization: token },
      });
      if (data) {
        fetchSentRequests();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleSentPath = ({ value }) => {
    setSentPath(value === "group" ? "grreq" : value === "direct" ? "drreq" : null);
  };

  const socketReflectReject = React.useCallback(() => {
    socket.on("reflect-reject", () => {
      fetchSentRequests();
    });
  }, [socket, fetchSentRequests]);

  React.useEffect(() => {
    fetchSentRequests();
  }, [fetchSentRequests]);

  React.useEffect(() => {
    socketReflectReject();
  }, [socketReflectReject]);

  return (
    <div className="cstm-flex justify-start flex-col gap-3 bg-gr3 p-2 w-full rounded-md overflow-y-auto cstm-scrollbar h-64 scrollbar-thumb-gr2">
      <ErrMsg err={err} setErr={setErr} />
      <div className="font-head text-wht font-semibold">Sent Requests</div>
      <div className="cstm-flex w-full gap-3">
        <Radio
          name="sent_type"
          value="direct"
          checked={sentPath === "drreq"}
          id="direct"
          onChange={(e) => handleSentPath(e.target)}
          label="Direct"
          css="text-wht peer-checked:cstm-gbg-1-2 peer-checked:text-gr3"
        />
        <Radio
          name="sent_type"
          value="group"
          checked={sentPath === "grreq"}
          id="group"
          onChange={(e) => handleSentPath(e.target)}
          label="Group"
          css="text-wht peer-checked:cstm-gbg-1-2 peer-checked:text-gr3"
        />
      </div>

      {requests.map((request) => {
        return (
          <div
            key={request.request_id}
            className="w-full cstm-flex justify-start gap-3 p-2 bg-wht rounded-md"
          >
            <div className="w-10 h-10 rounded-full cstm-gbg-1-3" />
            <div className="truncate mr-auto w-6/12">
              <div className="font-head font-medium">{request.request_to_name}</div>
              <div className="font-body font-light text-sm">{request.request_to_email}</div>
            </div>
            <Button
              onClick={() => cancelRequests(request.request_id)}
              css="w-min text-xs bg-blk text-wht"
              label="Cancel"
            />
          </div>
        );
      })}
    </div>
  );
}
