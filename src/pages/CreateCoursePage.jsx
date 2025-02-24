import React, { useState } from "react";
import { createCourse } from "../api/CourseApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCoursePage = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
  });

  const navigator = useNavigate();

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseCreated = await createCourse({
      title: courseData.title,
      description: courseData.description,
    });
    if (courseCreated === 201) {
      toast.success("Course created successfully!");
      navigator("/");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Create a Course</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Course Title */}
        <div>
          <label className="block text-gray-700 font-medium">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md shadow hover:bg-blue-600 transition hover:cursor-pointer"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
