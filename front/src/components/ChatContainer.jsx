import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { recieveMessageRoute, sendMessageRoute } from "../api/api";
import ChatInput from "./Input";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  // Fetch chat messages when currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      const data = JSON.parse(localStorage.getItem("user"));
      if (data && currentChat) {
        try {
          const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
          });
          const fetchedMessages = response.data.map((msg) => ({
            ...msg,
            createdAt: msg.createdAt || new Date().toISOString(),
          }));
          setMessages(fetchedMessages);
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      }
    };

    fetchMessages();
  }, [currentChat]);

  // Handle sending new messages
  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data && currentChat) {
      const timestamp = new Date().toISOString();
      const messageObject = {
        fromSelf: true,
        message: msg,
        createdAt: timestamp,
      };

      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg: msg,
        createdAt: timestamp,
      });

      setMessages((prevMessages) => [...prevMessages, messageObject]);

      try {
        await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msg,
          createdAt: timestamp,
        });
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  // Handle receiving new messages
  useEffect(() => {
    if (socket.current) {
      const handleReceiveMessage = (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          createdAt: new Date().toISOString(),
        });
      };

      socket.current.on("msg-receive", handleReceiveMessage);

      return () => {
        socket.current.off("msg-receive", handleReceiveMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex flex-col h-full border-2 rounded-2xl p-4 relative">
      <div className="border-b mb-2">
        <h3 className="mb-2 text-2xl text-amber-50">
          Chat with:{" "}
          <span className="text-amber-950">{currentChat.username}</span>
        </h3>
      </div>
      <div className="flex flex-col overflow-y-auto border rounded-2xl h-full p-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg max-w-xs ${
              message.fromSelf
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-100 text-black self-start"
            }`}
          >
            <div className="">
              <p>{message.message}</p>
              <small className="text-gray-800">
                {formatDate(message.createdAt)}
              </small>{" "}
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>{" "}
      </div>
      <div className="bottom-0 w-full">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}
