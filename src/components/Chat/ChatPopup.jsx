import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useState } from "react";

export default function ChatPopup({ onClose }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="fixed bottom-24 right-6 w-80 h-full max-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden z-50">
      <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-blue-50">
        <span className="font-semibold text-sm text-gray-700">
          {selectedConversation ? "Chat" : "Your Messages"}
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ✖
        </button>
      </div>

      {selectedConversation ? (
        <ChatWindow
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      ) : (
        <ChatList onSelect={setSelectedConversation} />
      )}
    </div>
  );
}
