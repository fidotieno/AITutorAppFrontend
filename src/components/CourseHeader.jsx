import React from "react";

const CourseHeader = ({ course }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-red-600">{course.title}</h1>
      <p className="text-gray-600 text-lg">Instructor: {course.instructor}</p>

      {/* Thumbnail or Preview Video */}
      {course.previewVideo ? (
        <video controls className="w-full mt-4 rounded-md shadow-md">
          <source src={course.previewVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded-md shadow-md mt-4"
        />
      )}
    </div>
  );
};

export default CourseHeader;
