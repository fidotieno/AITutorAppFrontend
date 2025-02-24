import CourseCard from "../components/CourseCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getEnrolledCourses, enrollCourse } from "../api/CourseApis";
import courseFormatter from "../utils/FormatCourses";

const StudentDashboard = ({ courses }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showAllEnrolled, setShowAllEnrolled] = useState(false);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      let coursesData = [];
      try {
        coursesData = await getEnrolledCourses();
        const coursesArray = coursesData.enrolledCourses;
        const cleanedCourses = courseFormatter(coursesArray);
        setEnrolledCourses(cleanedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    const fetchCourses = () => {
      let coursesData = [];
      try {
        coursesData = courses;
        const coursesArray = coursesData.courses;
        const cleanedCourses = courseFormatter(coursesArray);
        setAvailableCourses(cleanedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const handleEnroll = (courseId) => {
    const enrollInCourse = async () => {
      try {
        const response = await enrollCourse({ courseId });
        if (response === 200) {
          toast.success("Enrolled successfully!");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        const updatedEnrolledCourses = await getEnrolledCourses();
        const cleanedCourses = courseFormatter(
          updatedEnrolledCourses.enrolledCourses
        );
        setEnrolledCourses(cleanedCourses);
      } catch (error) {
        console.error("Failed to enroll in course:", error);
      }
    };

    enrollInCourse();
  };

  // Filter out enrolled courses from available courses
  const availableCoursesToDisplay = availableCourses.filter(
    (availableCourse) =>
      !enrolledCourses.some((enrolledCourse) => enrolledCourse.id === availableCourse.id)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        🎓 Student Dashboard
      </h1>

      {/* Enrolled Courses */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllEnrolled
            ? enrolledCourses
            : enrolledCourses.slice(0, 2)
          ).map((course) => (
            <CourseCard key={course.id} course={course} isEnrolled={true} />
          ))}
        </div>
        {enrolledCourses.length > 2 && (
          <button
            onClick={() => setShowAllEnrolled(!showAllEnrolled)}
            className="mt-4 text-blue-500 underline hover:cursor-pointer"
          >
            {showAllEnrolled ? "Show Less" : "View All My Courses"}
          </button>
        )}
      </section>

      {/* Available Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCoursesToDisplay.slice(0, 2).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={false}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
        <Link
          to="/all-courses"
          className="mt-4 inline-block text-blue-500 underline"
        >
          View All Available Courses
        </Link>
      </section>
    </div>
  );
};

export default StudentDashboard;
