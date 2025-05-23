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

  // Exclude enrolled courses
  const courses = courseFormatter(
    allCourses.courses.filter(
      (course) => !course.studentsEnrolled.includes(studentId)
    )
  );

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrollHandler = async (courseId) => {
    try {
      const response = await enrollCourse({ courseId });
      if (response === 200) {
        toast.success("Enrollment request successful!");
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
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600 flex items-center justify-center gap-3">
        <span className="animate-bounce">📚</span> All Courses
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Search by title, instructor, or level..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-5 py-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Course List */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id || course.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-200 mt-1">
                  Instructor: {course.instructor || "Unknown"}
                </p>
              </div>

              {/* Body */}
              <div className="p-5 text-sm space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Level:</span>{" "}
                  {course.level || "All Levels"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Duration:</span>{" "}
                  {course.duration || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Format:</span>{" "}
                  {course.courseFormat || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">
                    Students Enrolled:
                  </span>{" "}
                  {course.totalStudentsEnrolled || 0}
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-100 flex justify-center rounded-b-xl">
                <button
                  onClick={() => enrollHandler(course._id || course.id)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 hover:scale-105 transform transition"
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-20 text-gray-500">
          <div className="text-5xl animate-pulse mb-4">🔎</div>
          <p className="text-lg font-medium">
            No courses found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllCoursesPage;
