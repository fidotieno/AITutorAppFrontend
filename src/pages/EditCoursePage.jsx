import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourse,
  editCourse,
  deleteCourseFile,
  replaceCourseFile,
} from "../api/CourseApis";
import { toast } from "react-toastify";
import FileUploader from "../components/FileUploader";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replacingFile, setReplacingFile] = useState(null);

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

  const handleDeleteFile = async (fileId) => {
    const response = await deleteCourseFile(id, fileId);
    if (response === 200) {
      toast.success("File deleted successfully!");
      setCourseData({
        ...courseData,
        files: courseData.files.filter((file) => file._id !== fileId),
      });
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

          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md shadow hover:bg-blue-600 transition hover:cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* File Management */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-semibold mb-3">Uploaded Files</h2>
        <FileUploader courseId={id} />
        {courseData.files && courseData.files.length > 0 ? (
          <ul className="border rounded-md p-4 bg-gray-50">
            {courseData.files.map((file) => (
              <li
                key={file._id}
                className="flex flex-col sm:flex-row justify-between items-center border-b py-2 last:border-none"
              >
                <div className="flex items-center gap-4">
                  {file.type === "image" ? (
                    <img
                      src={file.url.replace("dl=0", "raw=1")}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : file.type === "pdf" ? (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 {file.name}
                    </a>
                  ) : (
                    <video controls className="w-20 h-12">
                      <source src={file.url} type="video/mp4" />
                    </video>
                  )}
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <label className="cursor-pointer px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleReplaceFile(file.name, e.target.files[0])
                      }
                    />
                  </label>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => handleDeleteFile(file.name)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
