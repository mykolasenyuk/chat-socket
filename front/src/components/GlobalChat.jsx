import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

function GlobalChat({
  globalMessages,
  setGlobalMessages,
  handleSendGlobalMessage,
  currentUser,
}) {
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef();
  const audioRecorder = useAudioRecorder();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [globalMessages]);

  const sendMessage = () => {
    const messageId = uuidv4();
    const createdAt = new Date().toISOString();
    handleSendGlobalMessage(messageText, messageId, createdAt, false);
    setMessageText("");
  };

  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendAudioMessage = async (audioBlob) => {
    const base64Audio = await blobToBase64(audioBlob);
    const base64WithoutPrefix = base64Audio.replace(/^data:.+;base64,/, ""); // Remove data URL prefix
    const messageId = uuidv4();
    const createdAt = new Date().toISOString();
    handleSendGlobalMessage(base64WithoutPrefix, messageId, createdAt, true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-full border-2 rounded-2xl p-4">
      <h2 className="mb-4 text-amber-50 text-2xl border-b">General Chat</h2>
      <div className="flex flex-col overflow-y-auto" style={{ height: "75%" }}>
        {globalMessages.map((message, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-xl max-w-xs ${
              message.sender?.username === currentUser.username
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            <strong>{message.sender?.username || "Unknown"}:</strong>
            {message.isAudio ? (
              <audio
                controls
                src={`data:audio/webm;codecs=opus;base64,${message.message.voice}`}
              />
            ) : (
              message.message.text
            )}
            <br />
            <small className="text-gray-800">
              {formatDate(message.createdAt)}
            </small>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>
      <div className="flex mt-4 justify-between">
        <AudioRecorder
          onRecordingComplete={handleSendAudioMessage}
          recorderControls={audioRecorder}
          classes={{
            AudioRecorderStart:
              "ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-2",
            AudioRecorderStop:
              "ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-2",
          }}
        />
        <div className="pl-4 flex w-1/2 justify-between">
          <input
            type="text"
            placeholder="Type your message here"
            className="w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={messageText}
            onChange={handleMessageChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlobalChat;
