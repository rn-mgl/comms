import React from "react";

import { AiOutlineEdit } from "react-icons/ai";
import { useGlobalContext } from "../../context";
import axios from "axios";

import ErrMsg from "../GLOBALS/ErrMsg";
import UpdateUserData from "../USER DATA/UpdateUserData";
import SingleDetails from "../USER DATA/SingleDetails";

export default function UserData() {
  const [userData, setUserData] = React.useState({});
  const [err, setErr] = React.useState({ msg: "", active: false });
  const [canUpdateUserData, setCanUpdateUserData] = React.useState(false);
  const [updateType, setUpdateType] = React.useState("all");
  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const fetchUserData = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/user/${user}`, {
        headers: { Authorization: token },
      });
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, user]);

  const handleCanUpdateUserData = () => {
    setCanUpdateUserData((prev) => !prev);
  };

  const handleUpdateType = (type) => {
    setUpdateType(type);
  };

  React.useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  return (
    <>
      <ErrMsg err={err} setErr={setErr} />
      {canUpdateUserData && (
        <UpdateUserData
          fetchUserData={fetchUserData}
          handleUpdateType={handleUpdateType}
          updateType={updateType}
          handleCanUpdateUserData={handleCanUpdateUserData}
        />
      )}
      <div
        className="p-3 w-full rounded-md bg-gr3 cstm-flex justify-start gap-3
                  t:flex-col"
      >
        <div
          className="w-16 h-16 rounded-full cstm-flex cstm-gbg-1-2 bg-cover bg-center hover:opacity-70 cursor-pointer
                    m-m:w-20 m-m:h-20
                    l-s:w-24 l-s:h-24"
          style={{ backgroundImage: userData?.image && `url(${userData.image})` }}
        >
          <AiOutlineEdit
            className="ml-auto text-wht opacity-80 cursor-pointer mt-auto"
            onClick={() => {
              handleUpdateType("image");
              handleCanUpdateUserData();
            }}
          />
        </div>
        <div
          className="text-wht font-head w-40 truncate
          m-m:w-52
          m-l:w-64
          t:w-full
                      t:text-center"
        >
          <div className="font-bold">{`${userData?.name} ${userData?.surname}`}</div>
          <div className="font-light text-sm">{userData?.email}</div>
        </div>
        <AiOutlineEdit
          className="ml-auto text-wht opacity-80 cursor-pointer
                    t:mx-auto"
          onClick={() => {
            handleUpdateType("all");
            handleCanUpdateUserData();
          }}
        />
      </div>
      <SingleDetails
        handleUpdateType={handleUpdateType}
        handleCanUpdateUserData={handleCanUpdateUserData}
        userData={userData}
      />
    </>
  );
}
