import React, { useState } from "react";

const CourseCurriculum = ({ lessons }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Course Curriculum</h2>
      <ul className="border rounded-md p-4 bg-gray-50">
        {(expanded ? lessons : lessons.slice(0, 3)).map((lesson, index) => (
          <li key={index} className="py-2 border-b last:border-none">
            {lesson}
          </li>
        ))}
      </ul>
      {lessons.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-blue-500 underline"
        >
          {expanded ? "Show Less" : "View All Lessons"}
        </button>
      )}
    </div>
  );
};

export default CourseCurriculum;
