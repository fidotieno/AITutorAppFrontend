import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse, editCourse } from "../api/CourseApis";
import { toast } from "react-toastify";
import FileUploader from "../components/FileUploader";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async (id) => {
      try {
        const data = await getCourse(id);
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData(id);
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await editCourse(id, {
      title: courseData.title,
      description: courseData.description,
    });
    if (response === 200) {
      toast.success("Course updated successfully!");
      navigate(`/view-course/${id}`);
    } else toast.error("Something went wrong. Please try again.");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseData) {
    return <div>Error loading course data.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Edit Course Details</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
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


        {/* Save Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md shadow hover:bg-blue-600 transition hover:cursor-pointer"
        >
          Save Changes
        </button>
      </form>
      <FileUploader courseId = {id}/>
    </div>
  );
};

export default EditCoursePage;
