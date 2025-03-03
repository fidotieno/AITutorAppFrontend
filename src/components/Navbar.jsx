import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const auth = useAuth();
  const navigator = useNavigate();

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="text-xl font-semibold hover:text-gray-300 transition duration-300"
      >
        EduTech
      </Link>
      {auth.token && (
        <div className="flex items-center gap-6">
          <Link
            to="/view-profile"
            className="hover:text-gray-300 transition duration-300"
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              auth.logout();
              navigator("/login");
            }}
            className="flex items-center gap-2 hover:text-gray-300 transition duration-300 hover:cursor-pointer"
          >
            Logout
            <FaSignOutAlt size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
