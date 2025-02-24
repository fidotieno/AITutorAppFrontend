import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourse } from "../api/CourseApis";
import CourseMaterials from "../components/CourseMaterials"; 

const CourseDetailsPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async (id) => {
      try {
        const data = await getCourse(id);
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      }
    };

    fetchCourseData(id);
  }, [id]);

  if (!courseData) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <h1 className="text-3xl font-bold text-blue-600">{courseData.title}</h1>
      <p className="text-gray-700 mt-2">{courseData.description}</p>

      {/* Course Materials Section */}
      <CourseMaterials files={courseData.files} />

      {/* List of Enrolled Students */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Enrolled Students</h2>
        {courseData.studentsEnrolled.length > 0 ? (
          <ul className="border rounded-md p-4 bg-gray-50">
            {courseData.studentsEnrolled.map((student) => (
              <li
                key={student._id}
                className="flex justify-between items-center border-b py-2 last:border-none"
              >
                <span className="font-medium">{student.name}</span>
                <span className="text-sm text-gray-600">{student.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No students enrolled yet.</p>
        )}
      </section>

      {/* Edit Course Button (Only for Teachers) */}
      {auth.role === "teacher" && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:cursor-pointer"
          onClick={() => navigate(`/edit-course/${id}`)}
        >
          Edit Course
        </button>
      )}
    </div>
  );
};

export default CourseDetailsPage;
