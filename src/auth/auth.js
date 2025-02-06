"use strict";

// Register a new user
const registerUser = async (userData) => {
  const res = await fetch(process.env.VITE_APP_ENVIRONMENT == 'development' ? "/api/api/auth/register" : `${process.env.VITE_APP_BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.status;
};

// Login an existing user
const loginUser = async (userData) => {
  const res = await fetch(process.env.VITE_APP_ENVIRONMENT == 'development' ? "/api/api/auth/login" : `${process.env.VITE_APP_BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.status;
};

export { registerUser, loginUser };
