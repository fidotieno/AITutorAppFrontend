// api/aiApis.js
const API_URL =
  import.meta.env.VITE_APP_ENVIRONMENT == "development"
    ? `/api/api`
    : `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

export const askStudyAssistant = async (question) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/ai/study-assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to get answer from AI.");
  }

  return await response.json();
};
