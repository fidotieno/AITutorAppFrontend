export const createExam = async (examData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT === "development"
      ? "/api/exams"
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
