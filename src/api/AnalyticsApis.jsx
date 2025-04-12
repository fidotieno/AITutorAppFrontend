export const getStudentAnalytics = async (studentId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/analytics/${studentId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/analytics/${studentId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch assignments.");
  return res;
};
