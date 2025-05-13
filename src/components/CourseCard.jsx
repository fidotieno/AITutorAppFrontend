import { Link } from "react-router-dom";

const CourseCard = ({ course, isEnrolled, onEnroll }) => {
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
        {/* Course Details */}
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

      {/* Card Footer */}
      <div className="p-4 bg-gray-100 flex justify-between">
        {isEnrolled ? (
          <Link
            to={`/view-course/${course._id || course.id}`}
            className="px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200"
          >
            View Course
          </Link>
        ) : (
          <button
            onClick={() => onEnroll(course._id || course.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
