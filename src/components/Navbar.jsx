import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const auth = useAuth();
  const navigator = useNavigate();

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">AiTutor</h1>
      <button
        onClick={() => {
          auth.logout();
          navigator("/login");
        }}
        hidden={!auth.token}
        className="flex items-center gap-2 hover:text-gray-300 transition duration-300 hover:cursor-pointer"
      >
        Logout
        <FaSignOutAlt size={20} />
      </button>
    </nav>
  );
};

export default Navbar;
