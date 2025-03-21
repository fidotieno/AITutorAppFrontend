import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExam, submitExam } from "../api/ExamApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const TakeExamPage = () => {
  const { examId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]); // Store answers as an array
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExam(examId);
        setExam(data.exam);
      } catch (error) {
        toast.error("Failed to load exam.");
      }
    };

    fetchExam();
  }, [examId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter((ans) => ans.questionId !== questionId);
      return [...updatedAnswers, { questionId, response: value }];
    });
  };

  const handleSubmit = async () => {
    if (answers.length !== exam.questions.length) {
      return toast.error("Please answer all questions before submitting.");
    }

    setIsSubmitting(true);
    try {
      const status = await submitExam(examId, { answers });
      if (status === 201) {
        toast.success("Exam submitted successfully!");
        // navigate(`/exam/${examId}/results`);
      }
    } catch (error) {
      toast.error("Failed to submit exam.");
    }
    setIsSubmitting(false);
  };

  if (!exam) return <p>Loading exam...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{exam.title}</h1>
      <p className="text-gray-600 mb-4">{exam.description}</p>

      {exam.questions.map((q) => (
        <div key={q._id} className="mb-4">
          <p className="font-semibold">{q.questionText}</p>
          {q.type === "multiple-choice" ? (
            <div className="flex flex-col">
              {q.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full p-2 border rounded-md"
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
        {isSubmitting ? "Submitting..." : "Submit Exam"}
      </button>
    </div>
  );
};

export default TakeExamPage;
