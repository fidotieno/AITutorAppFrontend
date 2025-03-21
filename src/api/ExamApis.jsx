export const createExam = async (examData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? "/api/api/exams"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/exams`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examData),
    }
  );

  if (!res.ok) throw new Error("Failed to create exam.");
  return res.json();
};

export const deleteExam = async (examId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/exams/${examId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  if (!res.ok) throw new Error("Failed to delete exam.");
  return res.status;
};

export const editExam = async (examId, examData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/exams/${examId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examData),
    }
  );

  if (!res.ok) throw new Error("Failed to update exam.");
  return res.json();
};

export const getExam = async (examId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}/single`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/exams/${examId}/single`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch exam.");
  return res.json();
};

export const getExamByCourse = async (courseId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${courseId}/available`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/exams/${courseId}/available`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch exam.");
  let examData = await res.json();
  examData = examData["exams"];
  return examData;
};

export const submitExam = async (examId, examData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}/submit`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/exams/${examId}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(examData),
    }
  );
  if (!res.ok) throw new Error("Failed to submit exam.");
  return res.status;
};

export const gradeExamSubmission = async (examId, studentId, gradeData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}/grade/${studentId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/exams/${examId}/grade/${studentId}`,
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

export const getExamResults = async (examId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? `/api/api/exams/${examId}/submissions`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/exams/${examId}/submissions`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch exam results.");
  return res.json();
};
