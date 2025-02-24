import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md border border-gray-200">
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-gray-600">{course.description || "No description available."}</p>
      <Link
        to={`/view-course/${course._id}`}
        className="text-blue-500 mt-2 block hover:underline"
      >
        View Details
      </Link>
    </div>
  );
};

export default CourseCard;
