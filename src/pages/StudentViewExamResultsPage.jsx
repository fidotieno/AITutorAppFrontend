import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExam } from "../api/ExamApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const ViewExamResultsPage = () => {
  const { examId } = useParams();
  const auth = useAuth();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examData = await getExam(examId);
        setExam(examData.exam);

        // Find the student's submission
        const studentSubmission = examData.exam.submissions.find(
          (sub) => sub.studentId.toString() === auth.userId
        );

        setSubmission(studentSubmission);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load exam results.");
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, auth.user]);

  if (loading) return <p>Loading exam results...</p>;
  if (!submission) return <p>You have not taken this exam yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{exam.title} - Results</h1>
      <p className="text-gray-600 mb-4">{exam.description}</p>
      <p className="text-lg font-semibold">Your Score: {submission.score}</p>
      {submission.feedback && (
        <p className="text-gray-700 mt-2">
          <strong>Feedback:</strong> {submission.feedback}
        </p>
      )}

      {/* Display Questions & Answers */}
      <ul className="mt-4 space-y-4">
        {exam.questions.map((question) => {
          const studentAnswer = submission.answers.find(
            (ans) => ans.questionId === question._id
          );

          return (
            <li key={question._id} className="p-4 bg-gray-100 rounded-md">
              <p className="font-medium">{question.questionText}</p>
              <p className="text-sm text-gray-700">
                <strong>Your Answer:</strong>{" "}
                {studentAnswer?.response || "No answer provided"}
              </p>
              {question.type === "multiple-choice" && (
                <p className="text-sm text-green-600">
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ViewExamResultsPage;
