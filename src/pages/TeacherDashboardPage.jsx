import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCreatedCourses } from "../api/CourseApis";
import TeacherCourseCard from "../components/TeacherCourseCard";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCreatedCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Teacher Dashboard
      </h1>

      {/* Create Course Button */}
      <div className="mb-6">
        <Link
          to="/create-course"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
        >
          + Create New Course
        </Link>
      </div>

      {/* My Courses Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">My Courses</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 h-64 rounded-md"
                />
              ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <TeacherCourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
            <p className="text-lg font-medium">No courses found.</p>
            <p className="text-sm mt-1">Start by creating your first course.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;
