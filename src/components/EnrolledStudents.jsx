import React from "react";

const EnrolledStudents = ({ students }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Enrolled Students</h2>
      {students.length > 0 ? (
        <ul className="border rounded-md p-4 bg-gray-50">
          {students.map((student) => (
            <li key={student._id} className="py-2 border-b flex justify-between">
              <span className="font-medium">{student.name}</span>
              <span className="text-sm text-gray-600">{student.email}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No students enrolled yet.</p>
      )}
    </div>
  );
};

export default EnrolledStudents;
