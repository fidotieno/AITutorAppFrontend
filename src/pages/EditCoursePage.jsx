import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourse,
  editCourse,
  deleteCourseFile,
  replaceCourseFile,
  deleteCourse,
} from "../api/CourseApis";
import { toast } from "react-toastify";
import FileUploader from "../components/FileUploader";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replacingFile, setReplacingFile] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchCourseData = async () => {
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
    fetchCourseData();
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, field, index) => {
    const updatedArray = [...courseData[field]];
    updatedArray[index] = e.target.value;
    setCourseData({ ...courseData, [field]: updatedArray });
  };

  const addArrayItem = (field) => {
    setCourseData({ ...courseData, [field]: [...courseData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = courseData[field].filter((_, i) => i !== index);
    setCourseData({ ...courseData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await editCourse(id, {
      title: courseData.title,
      description: courseData.description,
      duration: courseData.duration,
      level: courseData.level,
      prerequisites: courseData.prerequisites,
      courseFormat: courseData.courseFormat,
      objectives: courseData.objectives,
    });
    if (response === 200) {
      toast.success("Course updated successfully!");
      navigate(`/view-course/${id}`);
    } else toast.error("Something went wrong. Please try again.");
  };

  const handleDeleteFile = async (fileName) => {
    const response = await deleteCourseFile(id, fileName);
    if (response === 200) {
      toast.success("File deleted successfully!");
      setCourseData({
        ...courseData,
        files: courseData.files.filter((file) => file.name !== fileName),
      });
      navigate(`/view-course/${id}`);
    } else {
      toast.error("Failed to delete file.");
    }
  };

  const handleReplaceFile = async (fileName, newFile) => {
    if (!newFile) return;

    const formData = new FormData();
    formData.append("file", newFile);

    const response = await replaceCourseFile(id, fileName, formData);
    if (response === 200) {
      toast.success("File replaced successfully!");
      setReplacingFile(null);
      const updatedData = await getCourse(id);
      setCourseData(updatedData);
    } else {
      toast.error("Failed to replace file.");
    }
  };

  // 🔥 DELETE COURSE HANDLER
  const handleDeleteCourse = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action is irreversible."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await deleteCourse(id);
      if (response === 200) {
        toast.success("Course deleted successfully!");
        navigate("/"); // 🔥 change this to wherever you want
      } else {
        toast.error("Failed to delete course.");
      }
    } catch (error) {
      toast.error("Error deleting course.");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseData) {
    return <div>Error loading course data.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[38.2%_61.8%] gap-6">
      {/* Course Edit Form */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Edit Course Details
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
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

          <div>
            <label className="block text-gray-700 font-medium">
              Course Code
            </label>
            <input
              type="text"
              value={courseData.courseCode}
              disabled
              className="w-full border p-2 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />

          <label className="block text-gray-700 font-medium">Duration</label>
          <input
            type="text"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />

          <label className="block text-gray-700 font-medium">Level</label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label className="block text-gray-700 font-medium">
            Course Format
          </label>
          <select
            name="courseFormat"
            value={courseData.courseFormat}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="Videos & PDFs">Videos & PDFs</option>
            <option value="Live Sessions">Live Sessions</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Dynamic Fields */}
          {["prerequisites", "objectives"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {courseData[field].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(e, field, index)}
                    className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(field, index)}
                    className="bg-red-500 text-white px-3 rounded-md"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(field)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
              >
                Add {field.slice(0, -1)}
              </button>
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md shadow hover:bg-blue-600 transition hover:cursor-pointer"
          >
            Save Changes
          </button>
          {/* 🔥 DELETE BUTTON */}
          <button
            onClick={handleDeleteCourse}
            disabled={deleting}
            className={`mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deleting ? "Deleting..." : "Delete Course"}
          </button>
        </form>
      </div>

      {/* File Management */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-3">Uploaded Files</h2>
        <FileUploader courseId={id} />

        <div className="mt-4 space-y-4">
          {courseData?.files?.length > 0 ? (
            courseData.files.map((file) => (
              <div
                key={file._id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <span className="text-gray-800">{file.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRefs.current[file.name]?.click()}
                    className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <input
                    type="file"
                    accept="*"
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[file.name] = el)}
                    onChange={(e) =>
                      handleReplaceFile(file.name, e.target.files[0])
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No files uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
