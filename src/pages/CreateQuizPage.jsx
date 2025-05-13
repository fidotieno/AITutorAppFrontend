import { useState } from "react";
import { createQuiz, generateQuizQuestions } from "../api/QuizApis"; // Make sure to create this API
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const { courseId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    questions: [],
    deadline: "",
    timeLimit: "",
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiNumber, setAiNumber] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleQuestionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText.trim())
      return toast.error("Question text is required.");

    if (newQuestion.points <= 0)
      return toast.error("Points must be greater than zero.");

    const question = { ...newQuestion };
    if (question.type === "open-ended") {
      delete question.options;
      delete question.correctAnswer;
    }

    setQuizData({ ...quizData, questions: [...quizData.questions, question] });

    setNewQuestion({
      questionText: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });
  };

  const handleCreateQuiz = async () => {
    if (!quizData.title.trim()) return toast.error("Quiz title is required.");
    if (quizData.questions.length === 0)
      return toast.error("At least one question is required.");
    if (!quizData.deadline) return toast.error("Deadline is required.");
    if (!quizData.timeLimit || quizData.timeLimit <= 0)
      return toast.error("Time limit must be greater than zero.");

    try {
      await createQuiz({ ...quizData, courseId });
      toast.success("Quiz created successfully!");
      setQuizData({ title: "", description: "", questions: [] });
      navigate(`/view-course/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create quiz.");
    }
  };

  const handleGenerateAIQuestions = async () => {
    if (!aiTopic.trim()) return toast.error("Please enter a topic.");
    if (aiNumber < 1 || aiNumber > 10)
      return toast.error("Number of questions must be between 1 and 10.");

    try {
      setLoadingAI(true);
      const generatedQuestions = await generateQuizQuestions(
        aiTopic,
        aiNumber,
        aiDifficulty
      );

      const updatedQuestions = generatedQuestions.map((q) => ({
        ...q,
        points: 1,
      }));

      setQuizData((prev) => ({
        ...prev,
        questions: [...prev.questions, ...updatedQuestions],
      }));

      setShowAIModal(false);
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate AI questions.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

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
      <label className="block text-sm font-medium mb-1">Deadline</label>
      <input
        type="datetime-local"
        value={quizData.deadline}
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
        value={quizData.timeLimit}
        onChange={(e) =>
          setQuizData({ ...quizData, timeLimit: e.target.value })
        }
        className="w-full p-2 border rounded-md mb-3"
      />

      {/* AI Button */}
      <button
        onClick={() => setShowAIModal(true)}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Generate Questions with AI 🤖
      </button>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-bold mb-4">Generate Questions</h2>
            <input
              type="text"
              placeholder="Topic"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="number"
              placeholder="Number of Questions"
              value={aiNumber}
              min={1}
              max={10}
              onChange={(e) => setAiNumber(Number(e.target.value))}
              className="w-full p-2 border rounded-md mb-2"
            />
            <select
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button
              onClick={handleGenerateAIQuestions}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition mt-2"
              disabled={loadingAI}
            >
              {loadingAI ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => setShowAIModal(false)}
              className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 transition mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-4">Add Question</h2>

      <input
        type="text"
        placeholder="Question text"
        value={newQuestion.questionText}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, questionText: e.target.value })
        }
        className="w-full p-2 border rounded-md mb-2"
      />

      <select
        value={newQuestion.type}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, type: e.target.value })
        }
        className="w-full p-2 border rounded-md mb-2"
      >
        <option value="multiple-choice">Multiple Choice</option>
        <option value="open-ended">Open-Ended</option>
      </select>

      <input
        type="number"
        placeholder="Points"
        value={newQuestion.points}
        min={1}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, points: Number(e.target.value) })
        }
        className="w-full p-2 border rounded-md mb-2"
      />

      {newQuestion.type === "multiple-choice" && (
        <div>
          {newQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={newQuestion.correctAnswer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
            }
            className="w-full p-2 border rounded-md mb-2"
          />
        </div>
      )}

      <button
        onClick={addQuestion}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-2"
      >
        Add Question
      </button>

      <h2 className="text-lg font-semibold mt-4">Questions Added</h2>
      <ul className="list-disc pl-4">
        {quizData.questions.map((q, index) => (
          <li key={index} className="mb-2 flex justify-between items-center">
            <span>
              {q.questionText}{" "}
              <span className="text-gray-500 text-sm">({q.points} pts)</span>
            </span>
            <button
              onClick={() => {
                const updated = [...quizData.questions];
                updated.splice(index, 1);
                setQuizData({ ...quizData, questions: updated });
              }}
              className="ml-4 text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCreateQuiz}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Create Quiz
      </button>
    </div>
  );
};

export default CreateQuiz;
