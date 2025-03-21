import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourse,
  enrollCourse,
  unenrollCourse,
  removeStudentFromCourse,
} from "../api/CourseApis";
import { getQuizByCourse, deleteQuiz } from "../api/QuizApis";
import { toast } from "react-toastify";
import CourseMaterials from "../components/CourseMaterials";
import CourseAssignments from "../components/CourseAssignments";
import { getExamByCourse, deleteExam } from "../api/ExamApis";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("materials"); // Default tab
  const [quizzes, setQuizzes] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getCourse(id);
        const examData = await getExamByCourse(id);
        const quizData = await getQuizByCourse(id);
        setCourseData(data);
        setExams(examData || []);
        setQuizzes(quizData || []);
        if (auth.userId) {
          setIsEnrolled(
            data.studentsEnrolled.some((student) => student._id === auth.userId)
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
        if (response === 200) toast.success("Unenrolled successfully.");
      } else {
        const response = await enrollCourse({ courseId: id });
        if (response === 200) toast.success("Enrolled successfully!");
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
      if (response === 200) toast.success("Student removed.");
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

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(quizId);
      toast.success("Quiz deleted successfully.");
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      toast.error("Failed to delete quiz.");
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      const status = await deleteExam(examId);
      if (status === 200) {
        toast.success("Exam deleted successfully.");
        setExams(exams.filter((exam) => exam._id !== examId));
      }
    } catch (error) {
      toast.error("Failed to delete exam.");
    }
  };

  if (!courseData) {
    return <p>Loading course details...</p>;
  }

  // Tab definitions
  const tabs = [
    { key: "materials", label: "Course Materials" },
    { key: "quizzes", label: "Quizzes" },
    { key: "exams", label: "Exams" },
    { key: "assignments", label: "Assignments" },
    { key: "students", label: "Enrolled Students" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <h1 className="text-3xl font-bold text-blue-600">{courseData.title}</h1>
      <p className="text-gray-700 mt-2">{courseData.description}</p>

      {/* Additional Course Information */}
      <div className="mt-4">
        <p className="text-gray-600">
          <strong>Instructor:</strong> {courseData.teacherId?.name}
        </p>
        <p className="text-gray-600">
          <strong>Category:</strong> {courseData.courseFormat}
        </p>
        <p className="text-gray-600">
          <strong>Duration:</strong> {courseData.duration} hours
        </p>
      </div>

      {/* Enrollment Button */}
      {auth.role === "student" && (
        <button
          className={`mt-4 px-6 py-2 text-lg rounded-md font-semibold shadow transition ${
            isEnrolled
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={handleEnrollment}
        >
          {isEnrolled ? "Unenroll" : "Enroll"}
        </button>
      )}

      {/* Tabs Navigation */}
      <div className="mt-6 border-b flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "materials" && (
          <CourseMaterials files={courseData.files} />
        )}
        {activeTab === "quizzes" && (
          <div>
            {auth.role === "teacher" && (
              <button
                onClick={() => navigate(`/quizzes/create/${id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
              >
                Create Quiz
              </button>
            )}
            <h2 className="text-xl font-semibold">Available Quizzes</h2>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => {
                const studentSubmission = quiz.submissions.find(
                  (submission) => submission.studentId === auth.userId
                );

                return (
                  <div
                    key={quiz._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>
                      {quiz.title} - Due:{" "}
                      {new Date(quiz.dueDate).toLocaleDateString()}
                    </span>
                    <div>
                      {auth.role === "teacher" ? (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/quizzes/edit/${quiz._id}`)
                            }
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md mx-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md mx-1"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/quizzes/grade/${quiz._id}`)
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-md mx-1"
                          >
                            View and Grade
                          </button>
                        </>
                      ) : (
                        <>
                          {studentSubmission ? (
                            <>
                              <span className="mx-2">
                                Grade: {studentSubmission.score ?? "Pending"}
                              </span>
                              <button
                                onClick={() =>
                                  navigate(`/quizzes/view/${quiz._id}`)
                                }
                                className="px-3 py-1 bg-blue-500 text-white rounded-md"
                              >
                                View Quiz
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/quizzes/take/${quiz._id}`)
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded-md"
                            >
                              Take Quiz
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No quizzes available.</p>
            )}
          </div>
        )}
        {activeTab === "exams" && (
          <div>
            {auth.role === "teacher" && (
              <button
                onClick={() => navigate(`/exams/create/${id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
              >
                Create Exam
              </button>
            )}
            <h2 className="text-xl font-semibold">Available Exams</h2>
            {exams.length > 0 ? (
              exams.map((exam) => {
                const studentSubmission = exam.submissions.find(
                  (submission) => submission.studentId === auth.userId
                );

                return (
                  <div
                    key={exam._id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>
                      {exam.title} - Due:{" "}
                      {new Date(exam.dueDate).toLocaleDateString()}
                    </span>
                    <div>
                      {auth.role === "teacher" ? (
                        <>
                          <button
                            onClick={() => navigate(`/exams/edit/${exam._id}`)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md mx-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md mx-1"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => navigate(`/exams/grade/${exam._id}`)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md mx-1"
                          >
                            View and Grade
                          </button>
                        </>
                      ) : (
                        <>
                          {studentSubmission ? (
                            <>
                              <span className="mx-2">
                                Grade: {studentSubmission.score ?? "Pending"}
                              </span>
                              <button
                                onClick={() =>
                                  navigate(`/exams/view/${exam._id}`)
                                }
                                className="px-3 py-1 bg-blue-500 text-white rounded-md"
                              >
                                View Exam
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/exams/take/${exam._id}`)
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded-md"
                            >
                              Take Exam
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No exams available.</p>
            )}
          </div>
        )}
        {activeTab === "assignments" && <CourseAssignments courseId={id} />}
        {activeTab === "students" && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Enrolled Students</h2>
            {courseData.studentsEnrolled.length > 0 ? (
              <ul className="border rounded-md p-4 bg-gray-50">
                {courseData.studentsEnrolled.map((student) => (
                  <li
                    key={student._id}
                    className="flex justify-between items-center border-b py-2 last:border-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full">
                        <img
                          src={student.profilePhoto.url}
                          alt="Image of Student"
                        />
                      </div>{" "}
                      {/* Profile Placeholder */}
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </div>
                    {auth.role === "teacher" && (
                      <button
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
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
        )}
      </div>

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
