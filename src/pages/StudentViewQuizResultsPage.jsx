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
  }, [quizId, auth.user]);

  if (loading) return <p>Loading quiz results...</p>;
  if (!submission) return <p>You have not taken this quiz yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{quiz.title} - Results</h1>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      <p className="text-lg font-semibold">Your Score: {submission.score}</p>
      {submission.feedback && (
        <p className="text-gray-700 mt-2">
          <strong>Feedback:</strong> {submission.feedback}
        </p>
      )}

      {/* Display Questions & Answers */}
      <ul className="mt-4 space-y-4">
        {quiz.questions.map((question) => {
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

export default ViewQuizResultsPage;
