import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const ProfilePage = () => {
  const [userData, setUserData] = useState({ user: {} });
  const [loading, setLoading] = useState(true);
  
  const auth = useAuth(); 

  useEffect(() => {
    try {
      const getData = async () => {
        const data = await auth.getUserProfile();
        setUserData(data);
      };
      getData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          My Profile
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Full Name:
          </label>
          <p className="text-gray-600">{userData.user["name"]}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Role:</label>
          <p className="text-gray-600">{userData.user["role"]}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Email:</label>
          <p className="text-gray-600">{userData.user["email"]}</p>
        </div>

        <Link
          to="/edit-profile"
          className="block text-center bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
