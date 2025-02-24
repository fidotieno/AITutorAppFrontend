import React from "react";
import { useNavigate } from "react-router-dom";

const NotLoggedInCard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center border border-gray-200 my-auto">
      {/* Icon */}
      <div className="text-blue-500 text-5xl mb-4">🔒</div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to AiTutor</h2>

      {/* Message */}
      <p className="text-gray-600 mt-2">
        Unlock premium learning experiences by logging in or signing up today.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition hover:cursor-pointer"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="text-blue-500 hover:underline text-sm hover:cursor-pointer"
        >
          Create an Account
        </button>
      </div>
    </div>
  );
};

export default NotLoggedInCard;
