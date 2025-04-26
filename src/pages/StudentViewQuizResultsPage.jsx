import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuiz } from "../api/QuizApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const ViewQuizResultsPage = () => {
  const { quizId } = useParams();
  const auth = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuiz(quizId);
        setQuiz(quizData.quiz);

        // Find the student's submission
        const studentSubmission = quizData.quiz.submissions.find(
          (sub) => sub.studentId.toString() === auth.userId
        );

        setSubmission(studentSubmission);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load quiz results.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, auth.userId]);

  if (loading) return <p>Loading quiz results...</p>;
  if (!submission) return <p>You have not taken this quiz yet.</p>;

  // Calculate total points available
  const totalPoints = quiz.questions.reduce(
    (acc, q) => acc + (q.points || 1),
    0
  );
  const percentageScore = ((submission.score / totalPoints) * 100).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{quiz.title} - Results</h1>
      <p className="text-gray-600 mb-4">{quiz.description}</p>

      <p className="text-lg font-semibold mb-2">
        Your Score: {submission.score} / {totalPoints} Points
      </p>
      <p className="text-md text-blue-600 mb-4">({percentageScore}%)</p>

      {submission.feedback && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4">
          <strong>Overall Feedback:</strong> {submission.feedback}
        </div>
      )}

      {/* Display Questions & Answers */}
      <ul className="mt-4 space-y-4">
        {quiz.questions.map((question) => {
          const studentAnswer = submission.answers.find(
            (ans) => ans.questionId === question._id
          );

          return (
            <li key={question._id} className="p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{question.questionText}</p>
                <span className="text-sm text-blue-600">
                  {question.points || 1} pts
                </span>
              </div>

              <p className="text-sm text-gray-700">
                <strong>Your Answer:</strong>{" "}
                {studentAnswer?.response || "No answer provided"}
              </p>

              {question.type === "multiple-choice" && (
                <p className="text-sm text-green-600">
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </p>
              )}

              {question.type === "open-ended" && studentAnswer?.feedback && (
                <div className="text-sm text-gray-700 mt-2">
                  <strong>AI Feedback:</strong> {studentAnswer.feedback}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ViewQuizResultsPage;
