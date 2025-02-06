import Navbar from "../components/Navbar";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const HomePage = () => {
  const auth = useAuth();
  const navigator = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      <Navbar />
      <div className="flex flex-grow justify-center items-center text-2xl font-semibold text-gray-800 flex-col">
        Hello, {auth.userName || "You're not yet signed in"}!
        <button
          onClick={() => {
            navigator("/login");
          }}
          hidden={auth.token}
          className="flex items-center gap-2 hover:text-gray-300 transition duration-300 hover:cursor-pointer"
        >
          Login
          <FaSignInAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
