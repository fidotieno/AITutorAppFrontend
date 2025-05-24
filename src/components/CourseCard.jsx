import { Link } from "react-router-dom";

const CourseCard = ({ course, status, onEnroll, onCancelEnrollment }) => {
  const renderFooter = () => {
    if (status === "enrolled") {
      return (
        <Link
          to={`/view-course/${course._id || course.id}`}
          className="px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md font-medium hover:opacity-90 transition duration-200"
        >
          View Course
        </Link>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="px-4 py-2 bg-yellow-200 text-yellow-800 font-medium rounded-md text-sm">
            Pending Approval
          </span>
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
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-md font-medium hover:opacity-90 transition duration-200"
      >
        Enroll Now
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-start rounded-t-xl">
        <div className="pr-3">
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p className="text-sm text-gray-200 flex items-center gap-2">
            Instructor:{" "}
            {course.instructor || course.teacherId?.name || "Unknown"}
          </p>
          <p className="text-sm italic text-gray-300">
            Code: {course.courseCode || "N/A"}
          </p>
        </div>

        {/* Profile Image */}
        {course.profilePhoto && (
          <img
            src={course.profilePhoto}
            alt="Instructor"
            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
          />
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-2 text-sm text-gray-800">
        <p>
          <span className="font-semibold">Level:</span>{" "}
          {course.level || "All Levels"}
        </p>
        <p>
          <span className="font-semibold">Duration:</span>{" "}
          {course.duration || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Format:</span>{" "}
          {course.format || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Students Enrolled:</span>{" "}
          {course.studentsEnrolled || 0}
        </p>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 flex justify-center">
        {renderFooter()}
      </div>
    </div>
  );
};

export default CourseCard;
