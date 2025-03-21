import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizResults, getQuiz, gradeQuizSubmission } from "../api/QuizApis";
import { toast } from "react-toastify";

const TeacherQuizViewPage = () => {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]); // Store questions
  const [grading, setGrading] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const [submissionsData, quizData] = await Promise.all([
          getQuizResults(quizId), // Fetch student submissions
          getQuiz(quizId), // Fetch quiz questions
        ]);

        setSubmissions(submissionsData.submissions || []);
        setQuizQuestions(quizData.quiz.questions || []); // Store questions
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load quiz data.");
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [quizId]);

  const handleGradeChange = (studentId, questionId, value) => {
    setGrading((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        grades: { ...(prev[studentId]?.grades || {}), [questionId]: value },
      },
    }));
  };

  const handleFeedbackChange = (studentId, feedback) => {
    setGrading((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], feedback },
    }));
  };

  const handleSubmitGrades = async (studentId) => {
    const { grades, feedback } = grading[studentId] || {};
    if (!grades || Object.keys(grades).length === 0) {
      return toast.error("Please provide grades for open-ended questions.");
    }

    try {
      await gradeQuizSubmission(quizId, studentId, { grades, feedback });
      toast.success("Grades submitted successfully!");

      // Update the submissions list to mark the quiz as graded
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.studentId._id === studentId ? { ...sub, graded: true } : sub
        )
      );
    } catch (error) {
      toast.error("Failed to submit grades.");
    }
  };

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Quiz Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission.studentId._id} className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">
              {submission.studentId.name} - Score: {submission.score}
            </h2>
            {submission.graded && <p className="text-green-500">Graded</p>}

            <ul className="list-disc pl-4">
              {submission.answers.map((answer) => {
                const question = quizQuestions.find((q) => q._id === answer.questionId);
                return (
                  <li key={answer.questionId} className="mb-4">
                    <p className="font-medium">{question?.questionText || "Question not found"}</p>
                    <p className="text-gray-600">Answer: {answer.response}</p>
                    {question?.type === "open-ended" && !submission.graded && (
                      <div className="mt-2">
                        <input
                          type="number"
                          placeholder="Grade"
                          min="0"
                          className="w-20 p-2 border rounded-md"
                          onChange={(e) =>
                            handleGradeChange(submission.studentId._id, answer.questionId, Number(e.target.value))
                          }
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {!submission.graded && (
              <div className="mt-2">
                <textarea
                  placeholder="Feedback (optional)"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => handleFeedbackChange(submission.studentId._id, e.target.value)}
                />
                <button
                  onClick={() => handleSubmitGrades(submission.studentId._id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Submit Grades
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherQuizViewPage;
