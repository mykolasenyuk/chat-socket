import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

import axios from "axios";
import { logoutRoute } from "../api/api";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(localStorage.getItem("user"))._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <button className={"p-2 rounded-full border"} onClick={handleClick}>
      <BiPowerOff />
    </button>
  );
}
