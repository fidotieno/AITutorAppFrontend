const API_BASE =
  import.meta.env.VITE_APP_ENVIRONMENT == "development"
    ? "/api/api/admins"
    : `${import.meta.env.VITE_APP_BACKEND_URL}/api/admins`;

export const getAllStudents = async (token) => {
  const res = await fetch(`${API_BASE}/students?role=student`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const updateStudentParents = async (studentId, emails, token) => {
  const res = await fetch(`${API_BASE}/students/${studentId}/parents`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(emails),
  });
  if (!res.ok) throw new Error("Failed to update parent emails");
  return res.json();
};

export const getStudentFees = async (studentId, token) => {
  const res = await fetch(`${API_BASE}/students/${studentId}/fees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch fee records");
  return res.json();
};

export const recordStudentFee = async (studentId, feeData, token) => {
  const res = await fetch(`${API_BASE}/students/${studentId}/fees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feeData),
  });
  if (!res.ok) throw new Error("Failed to record fee");
  return res.json();
};

export const approveEnrollment = async (studentId, courseId, token) => {
  const res = await fetch(
    `${API_BASE}/courses/${courseId}/students/${studentId}/approve`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to approve request.");
  return res.json();
};

export const rejectEnrollment = async (studentId, courseId, token) => {
  const res = await fetch(
    `${API_BASE}/courses/${courseId}/students/${studentId}/reject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to reject request.");
  return res.json();
};

export const getPendingEnrollmentsForAdmin = async (token) => {
  const res = await fetch(`${API_BASE}/students/pending-approvals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch approval records");
  return res.json();
};
