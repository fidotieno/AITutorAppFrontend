import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourse,
  enrollCourse,
  unenrollCourse,
  getEnrolledCourses,
  removeStudentFromCourse,
} from "../api/CourseApis";
import { toast } from "react-toastify";
import CourseMaterials from "../components/CourseMaterials";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getCourse(id);
        setCourseData(data);
        if (auth.user) {
          setIsEnrolled(
            data.studentsEnrolled.some(
              (student) => student._id === auth.user._id
            )
          );
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseData(null);
      }
    };

    fetchCourseData();
  }, [id, auth.user]);

  const handleEnrollment = async () => {
    try {
      if (isEnrolled) {
        const response = await unenrollCourse(id);
        if (response === 200) toast.success("Unenrollment successful!.");
        else
          toast.error("Error unenrolling from the course. Please try again.");
      } else {
        const response = await enrollCourse({ courseId: id });
        if (response === 200) toast.success("Enrollment successful!");
        else toast.error("Error enrolling in the course. Please try again.");
      }
      // Refresh course data
      const updatedCourse = await getCourse(id);
      setCourseData(updatedCourse);
      setIsEnrolled(!isEnrolled);
    } catch (error) {
      toast.error("Failed to update enrollment status.");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await removeStudentFromCourse(id, studentId);
      if (response === 200) toast.success("Student removed from the course.");
      else toast.error("Failed to remove student.");
      setCourseData({
        ...courseData,
        studentsEnrolled: courseData.studentsEnrolled.filter(
          (s) => s._id !== studentId
        ),
      });
    } catch (error) {
      toast.error("Failed to remove student.");
    }
  };

  if (!courseData) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <h1 className="text-3xl font-bold text-blue-600">{courseData.title}</h1>
      <p className="text-gray-700 mt-2">{courseData.description}</p>

      {/* Course Materials Section */}
      <CourseMaterials files={courseData.files} />

      {/* Enrollment Button */}
      {auth.role === "student" && (
        <button
          className={`mt-4 px-4 py-2 rounded-md shadow ${
            isEnrolled
              ? "bg-red-500 hover:bg-red-600 hover:cursor-pointer"
              : "bg-green-500 hover:bg-green-600 hover:cursor-pointer"
          } text-white transition`}
          onClick={handleEnrollment}
        >
          {isEnrolled ? "Unenroll" : "Enroll"}
        </button>
      )}

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
                {auth.role === "teacher" && (
                  <button
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => handleRemoveStudent(student._id)}
                  >
                    Remove
                  </button>
                )}
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
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => navigate(`/edit-course/${id}`)}
        >
          Edit Course
        </button>
      )}
    </div>
  );
};

export default CourseDetailsPage;
