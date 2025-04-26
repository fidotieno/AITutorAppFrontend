import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import ChatButton from "../components/Chat/ChatButton";
import AIStudyAssistant from "../components/AIStudyAssistant";
import { useAuth } from "../auth/AuthProvider";

const MainLayout = () => {
  const auth = useAuth();
  return (
    <>
      <Navbar />
      <main>
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
