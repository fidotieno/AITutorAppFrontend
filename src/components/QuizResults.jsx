import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizResults } from "../api/QuizApis";
import { toast } from "react-toastify";

const QuizResults = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
      }
    };

    fetchResults();
  }, [quizId]);

  if (!results) return <p>Loading results...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
      <p className="text-gray-600">Score: {results.submission.score}</p>
      <p className="text-gray-600">
        Feedback: {results.submission.feedback || "No feedback yet."}
      </p>
    </div>
  );
};

export default QuizResults;
