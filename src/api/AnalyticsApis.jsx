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

  if (!res.ok) throw new Error("Failed to fetch analytics data.");
  return res;
};

export const getCourseAnalytics = async (courseId) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/analytics/course/${courseId}`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/analytics/course/${courseId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch course analytics data.");
  return res;
};
