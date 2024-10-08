import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  allUsersRoute,
  host,
  receiveGlobalMessageRoute,
  sendGlobalMessageRoute,
} from "../api/api";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import GlobalChat from "../components/GlobalChat";
import Logout from "../components/LogoutButton";

function Chat() {
  const navigate = useNavigate();
  const socket = useRef(null);
  const [isGlobalChat, setIsGlobalChat] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [originalTitle, setOriginalTitle] = useState(document.title);

  useEffect(() => {
    const initUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    initUser();
  }, [navigate]);

  useEffect(() => {
    const fetchGlobalMessages = async () => {
      try {
        const response = await axios.post(receiveGlobalMessageRoute);
        setGlobalMessages(response.data);
      } catch (error) {
        console.error("Error fetching global messages", error);
      }
    };

    if (currentUser) {
      fetchGlobalMessages();
    }
  }, [currentUser]);

  useEffect(() => {
    const receiveGlobalMessage = (msg) => {
      setGlobalMessages((prevMessages) => {
        if (prevMessages.some((message) => message.id === msg.id)) {
          return prevMessages;
        }

        document.title = "👀 New Message";
        setTimeout(() => {
          document.title = originalTitle;
        }, 4000);

        return [
          ...prevMessages,
          {
            sender: { username: msg.senderName },
            message: msg.isAudio
              ? { voice: msg.message }
              : { text: msg.message },
            id: msg.id,
            createdAt: msg.createdAt,
            isAudio: msg.isAudio,
          },
        ];
      });
    };

    if (currentUser && !socket.current) {
      socket.current = io(host);

      socket.current.on("connect", () => {
        console.log("Socket connected");
        socket.current.emit("add-user", currentUser._id);
        console.log(`Emitting join-global-chat for user: ${currentUser._id}`);
        socket.current.emit("join-global-chat", currentUser._id);
      });

      socket.current.on("receive-global-message", (msg) => {
        receiveGlobalMessage(msg);
      });

      socket.current.on("user-joined", (data) => {
        if (data.userId !== currentUser._id) {
          toast.info(data.message);
        }
      });

      return () => {
        if (socket.current) {
          socket.current.off("receive-global-message", receiveGlobalMessage);
          socket.current.off("user-joined");
        }
      };
    }
  }, [currentUser, originalTitle]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(allUsersRoute);
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts", error);
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setIsGlobalChat(false);
    setCurrentChat(chat);
  };

  const handleSendGlobalMessage = async (
    messageContent,
    messageId,
    createdAt,
    isAudio = false
  ) => {
    if (messageContent.trim().length > 0 || isAudio) {
      const messageObject = {
        sender: currentUser._id,
        message: messageContent.trim(),
        senderName: currentUser.username,
        id: messageId,
        createdAt,
        isAudio,
      };

      socket.current.emit("send-global-message", messageObject);
      setGlobalMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: { username: currentUser.username },
          message: isAudio
            ? { voice: messageContent.trim() }
            : { text: messageContent.trim() },
          id: messageId,
          createdAt,
          isAudio,
        },
      ]);

      try {
        await axios.post(sendGlobalMessageRoute, messageObject);
        toast.success("🚀 Message sent");
      } catch (error) {
        toast.error("❌ Error sending message");
        console.error("Error sending global message", error);
      }
    }
  };

  const openGlobalChat = () => {
    setCurrentChat(null);
    setIsGlobalChat(true);
  };

  return (
    <div className="flex items-center bg-gray-500 justify-center min-h-screen p-4">
      <div className="w-11/12 flex justify-between p-4 bg-cyan-900 border rounded-lg h-full shadow-md">
        <div className="flex flex-col w-3/12 h-full justify-between">
          <div className={"w-full flex justify-between items-center"}>
            <Logout />
            <button
              className=" p-2 border rounded-2xl text-amber-50 bg-red-400 hover:scale-95 ease-in-out duration-300"
              onClick={openGlobalChat}
            >
              General chat
            </button>
          </div>

          <div className="p-2">
            <h2 className="text-3xl text-amber-50">Contacts:</h2>
            <Contacts
              contacts={contacts}
              changeChat={handleChatChange}
              isGlobalChat={isGlobalChat}
            />
          </div>
        </div>
        <div className="flex w-2/3 flex-col h-96">
          {isGlobalChat ? (
            <GlobalChat
              globalMessages={globalMessages}
              currentUser={currentUser}
              setGlobalMessages={setGlobalMessages}
              handleSendGlobalMessage={handleSendGlobalMessage}
            />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
