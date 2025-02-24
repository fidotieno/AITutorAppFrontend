import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import avatar from "../images/avatar-default.png";

const EditProfilePage = () => {
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null); // For displaying the new uploaded image

  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Fetch current user details to pre-fill form
    const fetchUserData = async () => {
      const userData = await auth.getUserProfile();
      setName(userData.user.name || "");
      setProfilePicture(userData.user.profilePicture || avatar);
    };

    fetchUserData();
  }, [auth]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProfilePicture(file); // Store the file for upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (profilePicture instanceof File) {
      formData.append("profilePicture", profilePicture);
    }

    const response = await auth.editUserProfile(formData);
    if (response === 200) {
      toast.success("Profile updated successfully!");
      navigate("/view-profile");
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-6">
          Edit Profile
        </h2>

        {/* Profile Picture Preview */}
        <div className="flex justify-center mb-4">
          <img
            src={preview || profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300 object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md"
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 hover:cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
