import React from "react";

import { useGlobalContext } from "../../context";
import { AiOutlineArrowLeft } from "react-icons/ai";

import Input from "../INPUT/Input";
import IconInput from "../INPUT/IconInput";
import Button from "../INPUT/Button";
import Submit from "../INPUT/Submit";
import SelectedFile from "../CHAT PANE/SelectedFile";
import FileViewer from "../CHAT BAR/FileViewer";
import ErrMsg from "../GLOBALS/ErrMsg";

import axios from "axios";
import * as textFns from "../../FUNCTIONS/textFunc";
import * as fileFns from "../../FUNCTIONS/fileFunc";

export default function UpdateUserData(props) {
  const [userData, setUserData] = React.useState({
    image: undefined,
    in_comms_name: undefined,
    name: "",
    surname: "",
    old_password: undefined,
    new_password: undefined,
  });
  const [selectedFile, setSelectedFile] = React.useState({
    fileName: undefined,
    fileType: undefined,
    fileUrl: undefined,
  });
  const [err, setErr] = React.useState({ msg: "", active: false });

  const { url } = useGlobalContext();
  const token = localStorage.getItem("token");
  const user = parseInt(localStorage.getItem("user"));
  const updateAll = props.updateType === "all";
  const updateName = props.updateType === "name";
  const updateSurame = props.updateType === "surname";
  const updateICN = props.updateType === "in_comms_name";
  const updatePassword = props.updateType === "password";
  const updateProfile = props.updateType === "image";

  const fetchUserData = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/user/${user}`, {
        headers: { Authorization: token },
      });

      if (data) {
        setUserData({
          image: !data.image ? undefined : data.image,
          in_comms_name: !data.in_comms_name ? undefined : data.in_comms_name,
          name: data.name,
          surname: data.surname,
          old_password: undefined,
          new_password: undefined,
        });
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: error, active: true });
    }
  }, [token, url, user]);

  const updateUser = async (e) => {
    e.preventDefault();
    const { name, surname, image, in_comms_name, old_password, new_password } = userData;

    if (
      updateAll &&
      (textFns.isEmpty(name) ||
        textFns.isEmpty(surname) ||
        (new_password !== undefined && textFns.isBlank(new_password)) ||
        (old_password !== undefined && textFns.isBlank(old_password)))
    ) {
      setErr({ msg: "Name and Surname could not be blank", active: true });
      return;
    } else if (updateName && textFns.isEmpty(name)) {
      setErr({ msg: "Name could not be blank", active: true });
      return;
    } else if (updateSurame && textFns.isEmpty(surname)) {
      setErr({ msg: "Surname could not be blank", active: true });
      return;
    } else if (updateICN && textFns.isEmpty(in_comms_name)) {
      setErr({ msg: "in_comms_name alone could not be blank", active: true });
      return;
    } else if (updatePassword && (textFns.isBlank(old_password) || textFns.isBlank(new_password))) {
      setErr({ msg: "Password fields could not be blank", active: true });
      return;
    }

    let fileLink = undefined;

    if ((updateAll || updateProfile) && image) {
      fileLink = await fileFns.uploadFile(e.target.image.files[0], url, setSelectedFile);
    }

    if (fileLink?.startsWith("Error")) {
      setErr({ msg: fileLink, active: true });
      return;
    }
    try {
      const { data } = await axios.patch(
        `${url}/user`,
        {
          name,
          surname,
          image: fileLink ? fileLink : image ? image : null,
          in_comms_name: !in_comms_name ? null : in_comms_name,
          old_password,
          new_password,
          update_type: props.updateType,
        },
        { headers: { Authorization: token } }
      );
      if (data) {
        props.handleCanUpdateUserData();
        props.fetchUserData();
      }
    } catch (error) {
      console.log(error);
      setErr({ msg: fileLink, active: true });
    }
  };

  const handleUserData = ({ name, value }) => {
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const removeFile = () => {
    setSelectedFile({
      fileName: undefined,
      fileType: undefined,
      fileUrl: undefined,
    });
    setUserData((prev) => {
      return {
        ...prev,
        image: undefined,
      };
    });
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      props.handleCanUpdateUserData();
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div
      onKeyDown={(e) => handleEscape(e)}
      tabIndex="0"
      className={`fixed w-full h-full top-0 left-0 backdrop-blur-sm cstm-flex z-20 overflow-y-auto cstm-scrollbar py-5 ${
        updateAll && "items-start"
      } `}
    >
      <ErrMsg err={err} setErr={setErr} />
      <form
        onSubmit={(e) => updateUser(e)}
        className="w-11/12 h-min rounded-md bg-gr1 shadow-md p-2 cstm-flex flex-col gap-3 justify-start 
                  t:w-6/12"
      >
        <AiOutlineArrowLeft
          className="mr-auto scale-125 cursor-pointer"
          onClick={props.handleCanUpdateUserData}
        />
        {(updateAll || updateName) && (
          <>
            <div className="font-head text-sm font-semibold text-left w-full">Update Name</div>
            <Input
              name="name"
              type="text"
              value={userData.name}
              placeholder="Enter Name"
              id="name"
              required={true}
              onChange={(e) => handleUserData(e.target)}
            />
          </>
        )}

        {(updateAll || updateSurame) && (
          <>
            <div className="font-head text-sm font-semibold text-left w-full">Update Surname</div>
            <Input
              name="surname"
              type="text"
              value={userData.surname}
              placeholder="Enter Surname"
              id="surname"
              required={true}
              onChange={(e) => handleUserData(e.target)}
            />
          </>
        )}

        {(updateAll || updateICN) && (
          <>
            <div className="font-head text-sm font-semibold text-left w-full">
              Update In Comms Name
            </div>
            <Input
              name="in_comms_name"
              type="text"
              value={userData.in_comms_name}
              placeholder="Enter In Comms Name"
              id="in_comms_name"
              onChange={(e) => handleUserData(e.target)}
            />
          </>
        )}

        {(updateAll || updatePassword) && (
          <>
            <div className="font-head text-sm font-semibold text-left w-full">Update Password</div>
            <Input
              name="old_password"
              type="password"
              value={userData.password}
              placeholder="Enter Old Password"
              id="old_password"
              required={true}
              onChange={(e) => handleUserData(e.target)}
            />
            <Input
              name="new_password"
              type="password"
              value={userData.password}
              placeholder="Enter New Password"
              id="new_password"
              required={true}
              onChange={(e) => handleUserData(e.target)}
            />
          </>
        )}

        {(updateAll || updateProfile) && (
          <>
            <div className="font-head text-sm font-semibold text-left w-full">
              Update Profile Picture
            </div>
            {selectedFile.fileUrl ? (
              <SelectedFile removeFile={removeFile} selectedFile={selectedFile} css="mx-auto" />
            ) : userData.image && !userData.image.includes("fakepath") ? (
              <div className="cstm-flex flex-col gap-2">
                <FileViewer file={userData.image} />
                <div
                  className="font-body text-xs
                            l-s:text-sm"
                >
                  Current Picture
                </div>
              </div>
            ) : null}

            <IconInput
              name="image"
              id="image"
              value={userData.image}
              onChange={(e) => {
                handleUserData(e.target);
                fileFns.filePreview(e.target.files[0], setSelectedFile);
              }}
            />
          </>
        )}

        {(selectedFile.fileUrl || userData.image) && (
          <Button label="Remove File" css="bg-gr2 text-wht" onClick={removeFile} />
        )}
        <Submit label="Update" css="bg-blk text-wht" />
      </form>
    </div>
  );
}
