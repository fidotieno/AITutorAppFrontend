export const createAssignment = async (courseId, assignmentData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/assignments/${courseId}/create`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/assignments/${courseId}/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(assignmentData),
    }
  );

  if (!res.ok) throw new Error("Failed to create assignment.");
  return res.json();
};

export const getAssignments = async (courseId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/assignments/${courseId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/assignments/${courseId}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch assignments.");
  return res.json();
};

export const submitAssignment = async (assignmentId, formData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/assignments/${assignmentId}/submit`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/assignments/${assignmentId}/submit`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Failed to submit assignment.");
  return res.json();
};

export const gradeAssignment = async (assignmentId, studentId, gradeData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/assignments/${assignmentId}/grade/${studentId}`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/assignments/${assignmentId}/grade/${studentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(gradeData),
    }
  );
  if (!res.ok) throw new Error("Failed to submit assignment.");
  return res.json();
};

export const getAssignmentSubmissions = async (assignmentId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/assignments/${assignmentId}/submissions`
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/assignments/${assignmentId}/submissions`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch submissions.");
  return res.json();
};

export const deleteAssignment = async (assignmentId) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? `/api/api/assignments/${assignmentId}`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/assignments/${assignmentId}`
    }`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to delete assignment.");
  return res.json();
};

export const resubmitAssignment = async (assignmentId, formData) => {
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? `/api/assignments/${assignmentId}/resubmit`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/assignments/${assignmentId}/resubmit`
    }`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Failed to resubmit assignment.");
  return res.json();
};
