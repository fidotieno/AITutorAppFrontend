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

  const handleUpdateQuiz = async () => {
    if (!quizData.title.trim()) return toast.error("Quiz title is required.");
    if (quizData.questions.length === 0) return toast.error("At least one question is required.");

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
        onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
        className="w-full p-2 border rounded-md mb-3"
      />

      <h2 className="text-lg font-semibold">Edit Questions</h2>
      <ul className="list-disc pl-4">
        {quizData.questions.map((q, index) => (
          <li key={q._id} className="mb-4">
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            {q.type === "multiple-choice" && (
              <div>
                {q.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...q.options];
                      updatedOptions[optIndex] = e.target.value;
                      handleQuestionChange(index, "options", updatedOptions);
                    }}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                ))}
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Correct Answer"
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handleUpdateQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
        Save Changes
      </button>
    </div>
  );
};

export default EditQuizPage;
