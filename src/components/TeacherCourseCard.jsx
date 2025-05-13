import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden transform transition duration-300 hover:shadow-xl">
      {/* Card Header */}
      <div className="p-4 bg-blue-600 text-white">
        <h3 className="text-xl font-bold">{course.title}</h3>
        <p className="text-sm text-gray-200">{course.level || "All Levels"}</p>
        <p className="text-sm text-gray-200 italic">
          Code: {course.courseCode || "N/A"}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        <p className="text-gray-700">
          {course.description || "No description available."}
        </p>

        {/* Course Details */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-semibold text-gray-800">Duration:</span>{" "}
            {course.duration || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Format:</span>{" "}
            {course.courseFormat || "N/A"}
          </p>
          {course.prerequisites && course.prerequisites.length > 0 && (
            <p>
              <span className="font-semibold text-gray-800">
                Prerequisites:
              </span>{" "}
              {course.prerequisites.join(", ")}
            </p>
          )}
          <p>
            <span className="font-semibold text-gray-800">
              Students Enrolled:
            </span>{" "}
            {course.studentsEnrolled.length || 0}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-100 flex justify-end">
        <Link
          to={`/view-course/${course._id}`}
          className="px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
