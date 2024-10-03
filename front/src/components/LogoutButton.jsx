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
    <button
      className={
        "p-2 w-8 h-8 flex items-center justify-center rounded-full border bg-amber-600 text-amber-50 hover:bg-red-500 hover:scale-95 ease-in-out duration-300"
      }
      onClick={handleClick}
    >
      <BiPowerOff />
    </button>
  );
}
