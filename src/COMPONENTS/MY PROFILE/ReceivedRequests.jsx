import React from "react";

import axios from "axios";
import { useGlobalContext } from "../../context";

import Button from "../INPUT/Button";
import Radio from "../INPUT/Radio";
import ErrMsg from "../GLOBALS/ErrMsg";

export default function ReceivedRequests() {
  const [requests, setRequests] = React.useState([]);
  const [receivedPath, setReceivedPath] = React.useState("drreq");
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");

  const fetchReceivedRequests = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/${receivedPath}`, {
        params: { request_type: "received" },
        headers: { Authorization: token },
      });
      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, receivedPath]);

  const acceptRequest = async (request_by, request_id) => {
    try {
      const { data } = await axios.patch(
        `${url}/${receivedPath}`,
        { request_id, request_by },
        { headers: { Authorization: token } }
      );
      if (data) {
        fetchReceivedRequests();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const rejectRequest = async (request_by, request_id) => {
    try {
      const { data } = await axios.delete(`${url}/${receivedPath}`, {
        data: { request_by, request_id },
        headers: { Authorization: token },
      });
      if (data) {
        fetchReceivedRequests();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  };

  const handleReceivedPath = ({ value }) => {
    setReceivedPath(value === "group" ? "grreq" : value === "direct" ? "drreq" : null);
  };

  React.useEffect(() => {
    fetchReceivedRequests();
  }, [fetchReceivedRequests]);

  return (
    <div className="cstm-flex justify-start flex-col gap-3 bg-gr1 p-2 w-full rounded-md overflow-y-auto cstm-scrollbar h-64 scrollbar-thumb-gr2">
      <ErrMsg err={err} setErr={setErr} />
      <div className="font-head text-blk font-semibold">Received Requests</div>
      <div className="cstm-flex w-full gap-3">
        <Radio
          name="received_type"
          value="direct"
          checked={receivedPath === "drreq"}
          id="direct"
          onChange={(e) => handleReceivedPath(e.target)}
          label="Direct"
          css="text-blk peer-checked:bg-blk peer-checked:text-wht"
        />
        <Radio
          name="received_type"
          value="group"
          checked={receivedPath === "grreq"}
          id="group"
          onChange={(e) => handleReceivedPath(e.target)}
          label="Group"
          css="text-blk peer-checked:bg-blk peer-checked:text-wht"
        />
      </div>
      {requests.map((request) => {
        console.log(request);
        return (
          <div
            key={request.request_id}
            className="w-full cstm-flex flex-col gap-5 p-2 bg-gr3 text-wht rounded-md"
          >
            <div className="cstm-flex w-full justify-start gap-3">
              <div className="w-10 h-10 rounded-full cstm-gbg-1-3" />
              <div className="truncate">
                <div className="font-head font-medium">{request.request_from_name}</div>
                <div className="font-body font-light text-sm ">{request.request_from_email}</div>
              </div>
            </div>

            <div className="cstm-flex w-full gap-5">
              <Button
                onClick={() => acceptRequest(request.request_by, request.request_id)}
                css="text-xs bg-gr1 text-blk"
                label="Accept"
              />
              <Button
                onClick={() => rejectRequest(request.request_by, request.request_id)}
                css="text-xs bg-none border-gr1 border-[1px]"
                label="Reject"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
