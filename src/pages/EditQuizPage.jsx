import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, editQuiz } from "../api/QuizApis";
import { toast } from "react-toastify";

const EditQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(quizId);
        setQuizData(data.quiz);
      } catch (error) {
        toast.error("Failed to load quiz.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleUpdateQuiz = async () => {
    if (!quizData.title.trim()) return toast.error("Quiz title is required.");
    if (quizData.questions.length === 0)
      return toast.error("At least one question is required.");

    try {
      await editQuiz(quizId, quizData);
      toast.success("Quiz updated successfully!");
      navigate(-1); // Go back to previous page
    } catch (error) {
      toast.error("Failed to update quiz.");
    }
  };

  if (!quizData) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
      <input
        type="text"
        placeholder="Quiz Title"
        value={quizData.title}
        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
        className="w-full p-2 border rounded-md mb-3"
      />
      <textarea
        placeholder="Quiz Description"
        value={quizData.description}
        onChange={(e) =>
          setQuizData({ ...quizData, description: e.target.value })
        }
        className="w-full p-2 border rounded-md mb-3"
      />
      // Insert this below the "Quiz Description" textarea
      <label className="block text-sm font-medium mb-1">Deadline</label>
      <input
        type="datetime-local"
        value={quizData.deadline ? quizData.deadline.slice(0, 16) : ""}
        onChange={(e) => setQuizData({ ...quizData, deadline: e.target.value })}
        className="w-full p-2 border rounded-md mb-3"
      />
      <label className="block text-sm font-medium mb-1">
        Time Limit (in minutes)
      </label>
      <input
        type="number"
        min={1}
        placeholder="Enter time limit in minutes"
        value={quizData.timeLimit || ""}
        onChange={(e) =>
          setQuizData({ ...quizData, timeLimit: Number(e.target.value) })
        }
        className="w-full p-2 border rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold mt-4">Edit Questions</h2>
      <ul className="list-disc pl-4">
        {quizData.questions.map((q, index) => (
          <li key={q._id || index} className="mb-6 border-b pb-4">
            <input
              type="text"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(index, "questionText", e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Question Text"
            />

            {/* Points field */}
            <input
              type="number"
              value={q.points || 1}
              min={1}
              onChange={(e) =>
                handleQuestionChange(index, "points", Number(e.target.value))
              }
              className="w-32 p-2 border rounded-md mb-2"
              placeholder="Points"
            />

            {q.type === "multiple-choice" && (
              <div>
                {q.options?.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                ))}
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(index, "correctAnswer", e.target.value)
                  }
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Correct Answer"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleUpdateQuiz}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditQuizPage;
