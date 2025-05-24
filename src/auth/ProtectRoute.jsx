import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const user = useAuth();
  const approved = localStorage.getItem("isApproved") === "true";
  if (!user.token) return <Navigate to="/login" />;
  if (user.role === "student" && !approved) {
    return <Navigate to="/unapproved" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
