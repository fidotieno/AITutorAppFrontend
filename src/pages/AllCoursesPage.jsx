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

  const courses = courseFormatter(
    allCourses.courses.filter((course) => {
      if (course.studentsEnrolled.includes(studentId)) {
        return false;
      }
      return true;
    })
  );

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrollHandler = (courseId) => {
    const enrollInCourse = async () => {
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
      }
    };
    enrollInCourse();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        📚 All Courses
      </h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">
                Instructor: {course.instructor}
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600 hover:cursor-pointer"
                onClick={() => enrollHandler(course.id)}
              >
                Enroll
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
