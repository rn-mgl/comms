import React from "react";

import * as dateFns from "../../FUNCTIONS/dateFunc";
import SingleData from "../SINGLE DETAILS/SingleData";

export default function SingleDetails(props) {
  return (
    <div
      className="p-2 rounded-md bg-gr1 w-full cstm-flex flex-col gap-3 text-sm
            t:flex-row t:justify-around t:items-start t:gap-0"
    >
      <SingleData
        onClickFns={() => {
          props.handleUpdateType("name");
          props.handleCanUpdateUserData();
        }}
        label="name"
        value={props.userData?.name ? props.userData.name : null}
        updateType="name"
      />

      <div
        className="cstm-divider bg-gr3 my-0 w-10/12 
                t:hidden"
      />

      <SingleData
        onClickFns={() => {
          props.handleUpdateType("surname");
          props.handleCanUpdateUserData();
        }}
        label="surname"
        value={props.userData?.surname ? props.userData.surname : null}
        updateType="surname"
      />

      <div
        className="cstm-divider bg-gr3 my-0 w-10/12 
                t:hidden"
      />

      <SingleData
        onClickFns={() => {
          props.handleUpdateType("in_comms_name");
          props.handleCanUpdateUserData();
        }}
        label="comms name"
        value={props.userData?.in_comms_name ? props.userData.in_comms_name : null}
        updateType="comms name"
      />

      <div
        className="cstm-divider bg-gr3 my-0 w-10/12 
                t:hidden"
      />

      <SingleData
        onClickFns={() => {
          props.handleUpdateType("password");
          props.handleCanUpdateUserData();
        }}
        label="password"
        value="********"
        updateType="password"
      />

      <div
        className="cstm-divider bg-gr3 my-0 w-10/12 
                t:hidden"
      />

      <SingleData
        label="date joined"
        value={props.userData?.date_joined ? dateFns.date(props.userData.date_joined) : null}
      />
    </div>
  );
}
