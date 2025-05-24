import CourseCard from "../components/CourseCard";
import AnalyticsDashboard from "../pages/StudentAnalyticsDashboard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getEnrolledCourses,
  enrollCourse,
  cancelEnrollmentRequest,
  getPendingEnrolledCourses,
} from "../api/CourseApis";
import courseFormatter from "../utils/FormatCourses";

const StudentDashboard = ({ courses }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [showAllEnrolled, setShowAllEnrolled] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrolledRes = await getEnrolledCourses();
        setEnrolledCourses(courseFormatter(enrolledRes.enrolledCourses));

        const pendingRes = await getPendingEnrolledCourses();
        setPendingCourses(courseFormatter(pendingRes.pendingEnrollments));

        const cleanedCourses = courseFormatter(courses?.courses || []);
        setAvailableCourses(cleanedCourses);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const response = await enrollCourse({ courseId });
      if (
        response === 200 ||
        response?.message?.includes("Enrollment request submitted")
      ) {
        toast.success("Enrollment request sent!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      const enrolledRes = await getEnrolledCourses();
      setEnrolledCourses(courseFormatter(enrolledRes.enrolledCourses));

      const pendingRes = await getPendingEnrolledCourses();
      setPendingCourses(courseFormatter(pendingRes.pendingEnrollments));
    } catch (error) {
      console.error("Failed to enroll in course:", error);
    }
  };

  const handleCancelEnrollment = async (courseId) => {
    try {
      const response = await cancelEnrollmentRequest(courseId);
      if (response === 200) {
        toast.success("Enrollment request cancelled.");
        const pendingRes = await getPendingEnrolledCourses();
        setPendingCourses(courseFormatter(pendingRes.pendingEnrollments));

        const enrolledRes = await getEnrolledCourses();
        setEnrolledCourses(courseFormatter(enrolledRes.enrolledCourses));
      } else {
        toast.error("Failed to cancel enrollment request.");
      }
    } catch (error) {
      console.error("Error cancelling enrollment request:", error);
    }
  };

  const availableCoursesToDisplay = availableCourses.filter(
    (course) =>
      !enrolledCourses.some((en) => en.id === course.id) &&
      !pendingCourses.some((pend) => pend.id === course.id)
  );

  return (
    <div className="p-6 max-w-screen-xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        🎓 Student Dashboard
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`px-6 py-2 rounded-lg font-medium transition shadow-md ${
            showAnalytics
              ? "bg-indigo-600 text-white"
              : "bg-white text-indigo-600 border border-indigo-600"
          }`}
        >
          {showAnalytics ? "Hide Analytics" : "View Analytics"}
        </button>
      </div>
      {showAnalytics && <AnalyticsDashboard />}

      {/* Enrolled Courses */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          📚 My Courses
        </h2>

        {enrolledCourses.length === 0 ? (
          <p className="text-gray-500 italic">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllEnrolled
                ? enrolledCourses
                : enrolledCourses.slice(0, 2)
              ).map((course) => (
                <CourseCard key={course.id} course={course} status="enrolled" />
              ))}
            </div>

            {enrolledCourses.length > 2 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAllEnrolled(!showAllEnrolled)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-500 rounded-md hover:bg-blue-50 transition duration-200"
                >
                  {showAllEnrolled ? "Show Less" : "See All My Courses"}
                  <span
                    className={`transform transition-transform duration-300 ${
                      showAllEnrolled ? "-rotate-90" : "rotate-90"
                    }`}
                  >
                    ▶
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Pending Approvals */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          ⏳ Pending Approvals
        </h2>
        {pendingCourses.length === 0 ? (
          <p className="text-gray-500 italic">No pending requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                status="pending"
                onCancelEnrollment={handleCancelEnrollment}
              />
            ))}
          </div>
        )}
      </section>

      {/* Available Courses */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          🆕 Available Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCoursesToDisplay.slice(0, 2).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              status="available"
              onEnroll={handleEnroll}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/all-courses"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            View All Available Courses
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
