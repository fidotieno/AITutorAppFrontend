export const fetchUnreadCount = async (token) => {
  const response = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/notifications/unread-count"
      : `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/notifications/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return await response.json();
};

export const fetchNotifications = async (token) => {
  const response = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/notifications/"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/notifications/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return await response.json();
};

export const markNotificationAsRead = async (id, token) => {
  const response = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? `/api/api/notifications/${id}/read`
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return await response.json();
};
