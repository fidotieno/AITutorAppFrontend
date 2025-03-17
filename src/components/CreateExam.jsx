import { useState } from "react";
import { createExam } from "../api/ExamApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const CreateExam = ({ courseId }) => {
  const auth = useAuth();
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    type: "multiple-choice",
    options: ["", "", "", ""], // Default 4 empty options
    correctAnswer: "",
  });

  const handleQuestionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText.trim())
      return toast.error("Question text is required.");

    const question = { ...newQuestion };
    if (question.type === "open-ended") {
      delete question.options;
      delete question.correctAnswer;
    }

    setExamData({ ...examData, questions: [...examData.questions, question] });

    // Reset new question input
    setNewQuestion({
      questionText: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
  };

  const handleCreateExam = async () => {
    if (!examData.title.trim()) return toast.error("Exam title is required.");
    if (examData.questions.length === 0)
      return toast.error("At least one question is required.");

    try {
      await createExam({ ...examData, courseId });
      toast.success("Exam created successfully!");
      setExamData({ title: "", description: "", questions: [] });
    } catch (error) {
      toast.error("Failed to create exam.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
      <input
        type="text"
        placeholder="Exam Title"
        value={examData.title}
        onChange={(e) => setExamData({ ...examData, title: e.target.value })}
        className="w-full p-2 border rounded-md mb-3"
      />
      <textarea
        placeholder="Exam Description"
        value={examData.description}
        onChange={(e) =>
          setExamData({ ...examData, description: e.target.value })
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
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Add Question
      </button>

      <h2 className="text-lg font-semibold mt-4">Questions Added</h2>
      <ul className="list-disc pl-4">
        {examData.questions.map((q, index) => (
          <li key={index} className="mb-2">
            {q.questionText}
          </li>
        ))}
      </ul>

      <button
        onClick={handleCreateExam}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create Exam
      </button>
    </div>
  );
};

export default CreateExam;
