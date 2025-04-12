import { useState } from "react";
import ChatPopup from "./ChatPopup";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 text-2xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
        onClick={() => setOpen(!open)}
      >
        💬
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
          1
        </span>
      </button>

      {open && <ChatPopup onClose={() => setOpen(false)} />}
    </>
  );
}
