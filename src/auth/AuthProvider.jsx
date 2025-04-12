import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || null
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const registerUser = async (userData) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
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

  const loginUser = async (userData) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
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

      const res = await response.json();

      if (res && res.user) {
        setUserName(res.user.name);
        setRole(res.user.role);
        setToken(res.token);
        setUserId(res.user._id);

        if (res.children) {
          localStorage.setItem("children", JSON.stringify(res.children));
        }

        // Store in localStorage for persistence
        localStorage.setItem("userName", res.user.name);
        localStorage.setItem("userId", res.user._id);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("token", res.token);

        return response.status;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const forgotPassword = async (userData) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? "/api/api/auth/forgot-password"
        : `${import.meta.env.VITE_APP_BACKEND_URL}/api/auth/forgot-password`,
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

  const resetPassword = async (userData, token) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? `/api/api/auth/reset-password/${token}`
        : `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/auth/reset-password/${token}`,
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

  const logout = () => {
    setUserName(null);
    setRole(null);
    setToken("");

    // Clear from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("children");

    return 0;
  };

  const getUserProfile = async () => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? "/api/api/users/get-profile"
        : `${import.meta.env.VITE_APP_BACKEND_URL}/api/users/get-profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  };

  const editUserProfile = async (userData) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? "/api/api/users/edit-profile"
        : `${import.meta.env.VITE_APP_BACKEND_URL}/api/users/edit-profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: userData,
      }
    );

    if (res.status === 200) {
      setUserName(userData.name);
      localStorage.setItem("userName", userData.name); // Update in localStorage
    }

    return res.status;
  };

  const getUsers = async (userType) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT === "development"
        ? `/api/api/users/all?role=${
            userType === "parent" ? "teacher" : "parent"
          }`
        : `${import.meta.env.VITE_APP_BACKEND_URL}/api/users/all?role=${
            userType === "parent" ? "teacher" : "parent"
          }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        userId,
        role,
        registerUser,
        loginUser,
        forgotPassword,
        resetPassword,
        logout,
        getUserProfile,
        editUserProfile,
        getUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
