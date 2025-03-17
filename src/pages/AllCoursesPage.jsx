import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import courseFormatter from "../utils/FormatCourses";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { enrollCourse } from "../api/CourseApis";

const AllCoursesPage = () => {
  const allCourses = useLoaderData();
  const navigator = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const auth = useAuth();
  const studentId = auth.userId;

  // Exclude courses the user is already enrolled in
  const courses = courseFormatter(
    allCourses.courses.filter((course) => !course.studentsEnrolled.includes(studentId))
  );

  // Search filter (by title, instructor, or level)
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrollHandler = async (courseId) => {
    try {
      const response = await enrollCourse({ courseId });
      if (response === 200) {
        toast.success("Enrolled successfully!");
        navigator("/");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      toast.error("Enrollment failed. Please try again later.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        📚 All Courses
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, instructor, or level..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-xl"
            >
              {/* Course Header */}
              <div className="p-4 bg-blue-600 text-white">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-200">
                  Instructor: {course.instructor || "Unknown"}
                </p>
              </div>

              {/* Course Details */}
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Level:</span> {course.level || "All Levels"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Duration:</span> {course.duration || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Format:</span> {course.courseFormat || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Students Enrolled:</span> {course.totalStudentsEnrolled || 0}
                </p>
              </div>

              {/* Enroll Button */}
              <div className="p-4 bg-gray-100 flex justify-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
                  onClick={() => enrollHandler(course._id || course.id)}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
