import React from "react";

const UnapprovedPage = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#f9fafb",
        color: "#333",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "3rem 4rem",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "#f87171", // soft red
          }}
        >
          Account Pending Approval
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
          Your account has not yet been approved by an administrator. Please
          check back later or contact support if you think this is a mistake.
        </p>
        <button
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => window.location.reload()}
          onMouseEnter={e => (e.target.style.backgroundColor = "#2563eb")}
          onMouseLeave={e => (e.target.style.backgroundColor = "#3b82f6")}
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default UnapprovedPage;
