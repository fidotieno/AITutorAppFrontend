const API_BASE_URL =
  import.meta.env.VITE_APP_ENVIRONMENT === "development"
    ? "/api/api/messages"
    : `${import.meta.env.VITE_APP_BACKEND_URL}/api/messages`;

export const fetchConversations = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const fetchMessages = async (conversationId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const sendMessage = async (
  conversationId,
  senderId,
  senderType,
  content
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversationId,
      senderId,
      senderType,
      content,
    }),
  });

  return response.json();
};

export const startConversation = async (
  userId1,
  userType1,
  userId2,
  userType2
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/conversation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId1, userType1, userId2, userType2 }),
  });

  if (!response.ok) {
    throw new Error("Failed to start conversation");
  }

  return response.json();
};
