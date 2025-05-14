import { useEffect, useState } from "react";
import { fetchConversations, startConversation } from "../../api/MessageApis";
import { useAuth } from "../../auth/AuthProvider";

export default function ChatList({ onSelect }) {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await auth.getUsers(auth.role);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    getConversations();
    fetchUsers();
  }, []);

  const handleStartConversation = async (targetUser) => {
    try {
      const newConv = await startConversation(
        auth.userId,
        auth.role,
        targetUser._id,
        targetUser.role
      );
      setConversations((prev) => [newConv, ...prev]);
      setShowUserList(false);
      onSelect(newConv);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  return (
    <div className="overflow-y-auto flex-1 p-2">
      <button
        onClick={() => setShowUserList((prev) => !prev)}
        className="w-full mb-4 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
      >
        Start New Conversation
      </button>

      {showUserList && (
        <div className="mb-4 bg-white border rounded p-2 shadow">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleStartConversation(user)}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <p className="font-medium">
                  {user.name}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    ({user.role})
                  </span>
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No users found.</p>
          )}
        </div>
      )}

      {conversations.map((conv) => {
        const other = conv.participants.find(
          (p) => p.userId._id !== auth.userId
        );
        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            className="cursor-pointer border border-gray-200 rounded-md p-2 mb-2 hover:bg-gray-100 transition"
          >
            <div className="font-semibold text-gray-700">
              {other.userId?.name || "Unknown User"} ({other.userType})
            </div>
            <div className="text-xs text-gray-500">{other.userId?.email}</div>
            <div className="text-sm text-gray-500 line-clamp-1">
              {conv.lastMessage?.content || "No messages yet"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
