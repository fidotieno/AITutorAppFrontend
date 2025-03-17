export const createQuiz = async (quizData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? "/api/quizzes"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(quizData),
    }
  );

  if (!res.ok) throw new Error("Failed to create quiz.");
  return res.json();
};

export const getQuiz = async (quizId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/quizzes/${quizId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes/${quizId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch quiz.");
  return res.json();
};

export const submitQuiz = async (quizId, quizData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/quizzes/${quizId}/submit`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes/${quizId}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(quizData),
    }
  );

  if (!res.ok) throw new Error("Failed to submit quiz.");
  return res.json();
};
