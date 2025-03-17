import React, { useState } from "react";
import { createCourse } from "../api/CourseApis";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCoursePage = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    prerequisites: "",
    courseFormat: "",
    objectives: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...courseData,
      prerequisites: courseData.prerequisites
        ? courseData.prerequisites.split(",").map((p) => p.trim())
        : [],
      objectives: courseData.objectives
        ? courseData.objectives.split("\n").map((o) => o.trim())
        : [],
    };

    const courseCreated = await createCourse(formattedData);

    if (courseCreated === 201) {
      toast.success("Course created successfully!");
      navigate("/");
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
          <label className="block text-gray-700 font-medium">Course Title</label>
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

        {/* Duration */}
        <div>
          <label className="block text-gray-700 font-medium">Duration</label>
          <input
            type="text"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 6 weeks"
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-gray-700 font-medium">Level</label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-gray-700 font-medium">
            Prerequisites (comma-separated)
          </label>
          <input
            type="text"
            name="prerequisites"
            value={courseData.prerequisites}
            onChange={handleChange}
            placeholder="e.g., Basic Computer Skills, Introduction to Programming"
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Course Format */}
        <div>
          <label className="block text-gray-700 font-medium">Course Format</label>
          <input
            type="text"
            name="courseFormat"
            value={courseData.courseFormat}
            onChange={handleChange}
            required
            placeholder="Videos & PDFs, Live Sessions or Hybrid"
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Objectives */}
        <div>
          <label className="block text-gray-700 font-medium">Objectives (one per line)</label>
          <textarea
            name="objectives"
            value={courseData.objectives}
            onChange={handleChange}
            required
            placeholder="e.g., Learn HTML basics\nUnderstand JavaScript fundamentals\nBuild a simple website"
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
