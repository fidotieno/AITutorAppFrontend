"use strict";

// Register a new user
const registerUser = async (userData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/auth/register"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  return res.status;
};

// Login an existing user
const loginUser = async (userData) => {
  const res = await fetch(
    import.meta.env.VITE_APP_ENVIRONMENT == "development"
      ? "/api/api/auth/login"
      : `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );
  return res.status;
};

export { registerUser, loginUser };
