import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const registerUser = async (userData) => {
    const res = await fetch(
      import.meta.env.VITE_APP_ENVIRONMENT == "development"
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
        import.meta.env.VITE_APP_ENVIRONMENT == "development"
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
      if (res) {
        setUserName(res.user["name"]);
        setRole(res.user["role"]);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        return response.status;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUserName(null);
    setRole(null);
    setToken("");
    localStorage.removeItem("token");
    return 0;
  };

  return (
    <AuthContext.Provider
      value={{ token, userName, role, registerUser, loginUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
