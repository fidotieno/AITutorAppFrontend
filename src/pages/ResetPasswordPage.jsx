import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();

  const userData = {
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.location.pathname.split("/").pop();
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }
    const response = await auth.resetPassword(userData, token);
    if (response == 200) {
      toast.success("Password reset successfully!");
      navigate("/login");
    } else {
      toast.error("Failed to reset Password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 hover:cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
