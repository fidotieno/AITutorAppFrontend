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
        // Enrolled Courses
        const enrolledRes = await getEnrolledCourses();
        setEnrolledCourses(courseFormatter(enrolledRes.enrolledCourses));

        // Pending Courses
        const pendingRes = await getPendingEnrolledCourses();
        setPendingCourses(courseFormatter(pendingRes.pendingEnrollments));

        // Available Courses
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

      // Refresh lists
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
        // Refresh pending and available courses
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

  // Filter courses already enrolled or pending from available
  const availableCoursesToDisplay = availableCourses.filter(
    (course) =>
      !enrolledCourses.some((en) => en.id === course.id) &&
      !pendingCourses.some((pend) => pend.id === course.id)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        🎓 Student Dashboard
      </h1>

      {/* Toggle Analytics */}
      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {showAnalytics ? "Hide Analytics" : "View Analytics"}
      </button>
      {showAnalytics && <AnalyticsDashboard />}

      {/* Enrolled Courses */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAllEnrolled
            ? enrolledCourses
            : enrolledCourses.slice(0, 2)
          ).map((course) => (
            <CourseCard key={course.id} course={course} status="enrolled" />
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

      {/* Pending Approvals */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
        {pendingCourses.length === 0 ? (
          <p className="text-gray-600 italic">No pending requests</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h2 className="text-xl font-semibold mb-2">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCoursesToDisplay.slice(0, 2).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              status="available"
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
