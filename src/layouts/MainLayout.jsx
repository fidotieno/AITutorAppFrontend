import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import ChatButton from "../components/Chat/ChatButton";
import AIStudyAssistant from "../components/AIStudyAssistant";
import { useAuth } from "../auth/AuthProvider";

const MainLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideBackButtonRoutes = ["/", "/dashboard", "/login", "/register"];
  const showBackButton = !hideBackButtonRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className="px-4 py-2 max-w-7xl mx-auto">
        {/* Back Button with Icon */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer"
          >
            <FaArrowLeft className="text-lg" />
            Back
          </button>
        )}

        <Outlet />
        <ToastContainer />
        {auth?.role === "student" && <AIStudyAssistant />}
        {(auth?.role === "parent" || auth?.role === "teacher") && (
          <ChatButton />
        )}
      </main>
    </>
  );
};

export default MainLayout;
