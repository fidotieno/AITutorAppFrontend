"use strict";

// Register a new user
const registerUser = async (userData) => {
  const res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const responseBody = await res.json();
  console.log(responseBody);
  return res.status;
};

// Login an existing user
const loginUser = async (userData) => {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.status;
};

export { registerUser, loginUser };
