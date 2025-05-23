import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
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
import CourseAnalyticsDashboard from "../components/CourseAnalyticsDashboard";
import avatar from "../images/avatar-default.png";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState("materials"); // Default tab
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getCourse(id);
        const quizData = await getQuizByCourse(id);
        setCourseData(data);
        setQuizzes(quizData || []);
        if (auth.userId) {
          setIsEnrolled(
            data.studentsEnrolled.some((student) => student._id === auth.userId)
          );
          setIsPending(
            data.pendingEnrollments?.some(
              (student) => student._id === auth.userId
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
        if (response === 200) toast.success("Unenrolled successfully.");
      } else if (!isPending) {
        const response = await enrollCourse({ courseId: id });
        if (response === 200) toast.success("Enrollment request sent!");
      }

      const updatedCourse = await getCourse(id);
      setCourseData(updatedCourse);
      setIsEnrolled(
        updatedCourse.studentsEnrolled.some((s) => s._id === auth.userId)
      );
      setIsPending(
        updatedCourse.pendingEnrollments?.some((s) => s._id === auth.userId)
      );
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

  if (!courseData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton height={30} width={`60%`} />
        <Skeleton count={5} className="mt-4" />
      </div>
    );
  }

  // Tab definitions
  const tabs = [
    { key: "materials", label: "Course Materials" },
    { key: "quizzes", label: "Quizzes" },
    { key: "assignments", label: "Assignments" },
    { key: "students", label: "Enrolled Students" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-md shadow mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{courseData.title}</h1>
        <div className="mt-2 flex items-center space-x-3">
          <img
            src={courseData.teacherId?.profilePhoto?.url || avatar}
            alt="Instructor"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          <span className="text-gray-700 font-medium">
            {courseData.teacherId?.name || "Unknown Instructor"}
          </span>
        </div>
        <p className="text-gray-700 mt-2">{courseData.description}</p>
      </div>

      {/* Additional Course Information */}
      <div className="mt-4">
        <p className="text-gray-600">
          <strong>Course Code:</strong> {courseData.courseCode || "N/A"}
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
              : isPending
              ? "bg-yellow-400 cursor-not-allowed text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={handleEnrollment}
          disabled={isPending}
        >
          {isEnrolled
            ? "Unenroll"
            : isPending
            ? "Enrollment Pending"
            : "Request Enrollment"}
        </button>
      )}
      {isPending && !isEnrolled && (
        <p className="mt-2 text-yellow-600 text-sm">
          Your enrollment request is awaiting admin approval.
        </p>
      )}

      {/* Tabs Navigation */}
      <div className="mt-6 border-b flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`pb-2 px-1 border-b-2 transition font-medium text-sm sm:text-base focus:outline-none focus-visible:ring-2 ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
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
                  <div className="bg-white border rounded-md p-4 mb-3 shadow-sm hover:shadow transition">
                    <div
                      key={quiz._id}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <span className="font-semibold text-blue-700">
                        {quiz.title}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        Due:{" "}
                        {new Date(quiz.deadline).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
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
                  </div>
                );
              })
            ) : (
              <p>No quizzes available.</p>
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
                      <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
                        <img
                          src={student.profilePhoto?.url || avatar}
                          alt="Image of Student"
                          className="absolute w-full h-full object-cover"
                        />
                      </div>
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
            {auth.role === "teacher" &&
              courseData.pendingEnrollments?.length > 0 && (
                <section className="mt-6">
                  <h2 className="text-xl font-semibold mb-3 text-yellow-700">
                    Pending Approvals
                  </h2>
                  <ul className="border rounded-md p-4 bg-yellow-50">
                    {courseData.pendingEnrollments.map((student) => (
                      <li
                        key={student._id}
                        className="flex justify-between items-center border-b py-2 last:border-none"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden relative">
                            <img
                              src={student.profilePhoto?.url || avatar}
                              alt="Pending Student"
                              className="absolute w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-medium">{student.name}</span>
                            <p className="text-sm text-gray-600">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
          </section>
        )}
        {activeTab === "analytics" && auth.role === "teacher" && (
          <CourseAnalyticsDashboard courseId={id} />
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
