import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "../api/QuizApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]); // Store answers as an array
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(quizId);
        setQuiz(data.quiz);
      } catch (error) {
        toast.error("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.questionId !== questionId
      );
      return [...updatedAnswers, { questionId, response: value }];
    });
  };

  const handleSubmit = async () => {
    if (answers.length !== quiz.questions.length) {
      return toast.error("Please answer all questions before submitting.");
    }

    setIsSubmitting(true);
    try {
      const status = await submitQuiz(quizId, { answers });
      if (status === 201) {
        toast.success("Quiz submitted successfully!");
        // navigate(`/quiz/${quizId}/results`);
      }
    } catch (error) {
      toast.error("Failed to submit quiz.");
    }
    setIsSubmitting(false);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-4">{quiz.description}</p>

      {quiz.questions.map((q) => (
        <div
          key={q._id}
          className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
        >
          {/* Points badge */}
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {q.points || 1} {q.points === 1 ? "Point" : "Points"}
          </div>

          {/* Question Text */}
          <p className="font-semibold mb-3">{q.questionText}</p>

          {/* Question Input */}
          {q.type === "multiple-choice" ? (
            <div className="flex flex-col space-y-2">
              {q.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full p-2 border rounded-md mt-2"
              placeholder="Your answer..."
              onChange={(e) => handleAnswerChange(q._id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {isSubmitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
};

export default TakeQuizPage;
