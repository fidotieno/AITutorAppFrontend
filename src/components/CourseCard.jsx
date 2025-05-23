import { Link } from "react-router-dom";

const CourseCard = ({ course, status, onEnroll, onCancelEnrollment }) => {
  const renderFooter = () => {
    if (status === "enrolled") {
      return (
        <Link
          to={`/view-course/${course._id || course.id}`}
          className="px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200"
        >
          View Course
        </Link>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-center gap-2">
          <button
            disabled
            className="px-4 py-2 bg-yellow-300 text-yellow-800 font-semibold rounded-md cursor-not-allowed"
          >
            Pending Approval
          </button>
          {onCancelEnrollment && (
            <button
              onClick={() => onCancelEnrollment(course._id || course.id)}
              className="text-sm text-red-600 underline hover:text-red-800 transition"
            >
              Cancel Request
            </button>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => onEnroll(course._id || course.id)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
      >
        Enroll
      </button>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-xl">
      {/* Card Header */}
      <div className="p-4 bg-blue-600 text-white">
        <h3 className="text-xl font-bold">{course.title}</h3>
        <p className="text-sm text-gray-200">
          Instructor: {course.instructor || course.teacherId?.name || "Unknown"}
        </p>
        <p className="text-sm text-gray-200 italic">
          Code: {course.courseCode || "N/A"}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-700 space-y-1">
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
            {course.studentsEnrolled || 0}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 flex justify-center">
        {renderFooter()}
      </div>
    </div>
  );
};

export default CourseCard;
