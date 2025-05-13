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
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // Time left in seconds

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(quizId);
        setQuiz(data.quiz);
        if (data.quiz.timeLimit) {
          const storedStartTime = localStorage.getItem(
            `quiz-${quizId}-startTime`
          );
          let startTime;

          if (storedStartTime) {
            startTime = parseInt(storedStartTime, 10);
          } else {
            startTime = Date.now();
            localStorage.setItem(
              `quiz-${quizId}-startTime`,
              startTime.toString()
            );
          }

          const timePassed = Math.floor((Date.now() - startTime) / 1000);
          const totalTime = data.quiz.timeLimit * 60;
          const remainingTime = totalTime - timePassed;

          setTimeLeft(remainingTime > 0 ? remainingTime : 0);
        }
      } catch (error) {
        toast.error("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Countdown effect
  useEffect(() => {
    if (!timeLeft || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when timer reaches zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (ans) => ans.questionId !== questionId
      );
      return [...updatedAnswers, { questionId, response: value }];
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const status = await submitQuiz(quizId, { answers });
      if (status === 201) {
        toast.success("Quiz submitted successfully!");
        localStorage.removeItem(`quiz-${quizId}-startTime`);
        navigate(`/quizzes/view/${quizId}`);
      }
    } catch (error) {
      toast.error("Failed to submit quiz.");
    }
    setIsSubmitting(false);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        {quiz.timeLimit && (
          <div className="text-red-600 font-semibold text-lg">
            Time Left: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-4">{quiz.description}</p>

      {quiz.questions.map((q) => (
        <div
          key={q._id}
          className="mb-6 p-4 border rounded-lg bg-gray-50 relative"
        >
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {q.points || 1} {q.points === 1 ? "Point" : "Points"}
          </div>

          <p className="font-semibold mb-3">{q.questionText}</p>

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
