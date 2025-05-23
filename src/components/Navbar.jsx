import { useState, useEffect, useRef } from "react";
import { FaSignOutAlt, FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchUnreadCount,
  fetchNotifications,
  markNotificationAsRead,
} from "../api/NotificationApis";

const Navbar = () => {
  const auth = useAuth();
  const navigator = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isStudent = auth?.role === "student";

  useEffect(() => {
    let intervalId;

    if (auth.token && isStudent) {
      loadUnreadCount();

      intervalId = setInterval(() => {
        loadUnreadCount();
      }, 60000);
    }

    return () => clearInterval(intervalId);
  }, [auth.token, isStudent]);

  const loadUnreadCount = async () => {
    try {
      const data = await fetchUnreadCount(auth.token);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to load unread count", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications(auth.token);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      loadNotifications();
    }
    setShowDropdown((prev) => !prev);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, auth.token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow-lg relative">
      <Link
        to="/"
        className="text-2xl tracking-wide font-bold hover:text-gray-100 transition duration-300"
      >
        EduTech
      </Link>

      {auth.token && (
        <div className="flex items-center gap-6 relative">
          {isStudent && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleBellClick}
                className="relative hover:bg-blue-700 transition p-2 rounded-full"
                aria-label="Notifications"
              >
                <FaBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in-down">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-600">
                      No notifications.
                    </p>
                  ) : (
                    <ul>
                      {notifications.map((n) => (
                        <li
                          key={n._id}
                          className={`p-3 border-b hover:bg-gray-100 ${
                            !n.isRead ? "bg-blue-100" : ""
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{n.content}</span>
                            {!n.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(n._id)}
                                className="text-xs text-blue-600 hover:underline ml-2"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User info */}
          <span className="text-sm hidden sm:block text-gray-100">
            Logged in as <span className="font-medium">{auth.userName}</span>{" "}
            <span className="italic text-gray-300">({auth.role})</span>
          </span>

          {/* Profile Icon */}
          <Link
            to="/view-profile"
            className="hover:text-gray-300 transition duration-300"
            aria-label="View Profile"
            title="View Profile"
          >
            <FaUserCircle size={22} />
          </Link>

          {/* Logout */}
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
