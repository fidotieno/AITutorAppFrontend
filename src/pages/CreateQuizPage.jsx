import { useState } from "react";
import { createQuiz } from "../api/QuizApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const CreateQuiz = () => {
  const { courseId } = useParams();
  const auth = useAuth();
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1, // Default 1 point
  });

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

    try {
      await createQuiz({ ...quizData, courseId });
      toast.success("Quiz created successfully!");
      setQuizData({ title: "", description: "", questions: [] });
    } catch (error) {
      toast.error("Failed to create quiz.");
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

      <h2 className="text-lg font-semibold">Add Question</h2>

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

      {/* New field for Points */}
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
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Question
      </button>

      <h2 className="text-lg font-semibold mt-4">Questions Added</h2>
      <ul className="list-disc pl-4">
        {quizData.questions.map((q, index) => (
          <li key={index} className="mb-2">
            {q.questionText}{" "}
            <span className="text-gray-500 text-sm">({q.points} pts)</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCreateQuiz}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create Quiz
      </button>
    </div>
  );
};

export default CreateQuiz;
