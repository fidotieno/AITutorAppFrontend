import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import ChatButton from "../components/Chat/ChatButton";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
        <ToastContainer />
        <ChatButton />
      </main>
    </>
  );
};

export default MainLayout;
