import { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "../../api/MessageApis";
import { useAuth } from "../../auth/AuthProvider";

export default function ChatWindow({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const auth = useAuth();
  const scrollRef = useRef(null);

  const getMessages = async () => {
    try {
      const data = await fetchMessages(conversation._id);
      setMessages(data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, 5000);
    return () => clearInterval(interval);
  }, [conversation]);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendTheMessage = async () => {
    if (!text.trim()) return;

    try {
      await sendMessage(conversation._id, auth.userId, auth.role, text);
      setText("");
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="p-2 border-b text-sm text-blue-600 cursor-pointer hover:underline"
        onClick={onBack}
      >
        ← Back
      </div>

      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-2"
        style={{ maxHeight: "calc(100% - 130px)" }} // Make sure there's space for the input box
      >
        {messages.map((msg) => {
          const isMe = msg.sender.userId === auth.userId;

          return (
            <div
              key={msg._id}
              className={`p-2 rounded-md text-sm max-w-[75%] ${
                isMe
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 self-start mr-auto"
              }`}
            >
              {msg.content}
            </div>
          );
        })}
      </div>

      {/* Input box */}
      <div className="p-2 border-t flex gap-2 items-center bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your message..."
        />
        <button
          onClick={sendTheMessage}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
