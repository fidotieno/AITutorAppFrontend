export const createQuiz = async (quizData) => {
  console.log(quizData);
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? "/api/api/quizzes"
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

export const deleteQuiz = async (quizId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes/${quizId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete quiz.");
  return res.json();
};

export const editQuiz = async (quizId, quizData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes/${quizId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(quizData),
    }
  );

  if (!res.ok) throw new Error("Failed to update quiz.");
  return res.json();
};

export const getQuiz = async (quizId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}/single`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/quizzes/${quizId}/single`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch quiz.");
  return res.json();
};

export const getQuizByCourse = async (courseId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${courseId}/available`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/quizzes/${courseId}/available`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch quiz.");
  let quizData = await res.json();
  quizData = quizData["quizzes"];
  return quizData;
};

export const submitQuiz = async (quizId, quizData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}/submit`
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
  return res.status;
};

export const gradeQuizSubmission = async (quizId, studentId, gradeData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}/grade/${studentId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/quizzes/${quizId}/grade/${studentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(gradeData),
    }
  );

  if (!res.ok) throw new Error("Failed to submit grades.");
  return res.json();
};

export const getQuizResults = async (quizId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/quizzes/${quizId}/submissions`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/quizzes/${quizId}/submissions`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch quiz results.");
  return res.json();
};
