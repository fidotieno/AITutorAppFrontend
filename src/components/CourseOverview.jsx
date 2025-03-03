import React from "react";

const CourseOverview = ({ course }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">What You’ll Learn</h2>
      <ul className="list-disc pl-5 text-gray-700 mt-2">
        {course.learningPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Requirements</h2>
      <ul className="list-disc pl-5 text-gray-700 mt-2">
        {course.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseOverview;
