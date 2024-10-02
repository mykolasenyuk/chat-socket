import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
// import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
    const [msg, setMsg] = useState("");

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (<>

        <div className="flex items-center p-4   border-gray-300">
            <div className=" mr-2">

            </div>
            <form className="flex items-center w-full" onSubmit={(event) => sendChat(event)}>
                <input
                    type="text"
                    placeholder="type your message here"
                    className="flex-1 p-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <IoMdSend className="text-2xl" />
                </button>
            </form>
        </div>
    </>
    );
}