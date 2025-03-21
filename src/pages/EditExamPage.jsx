import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExam, editExam } from "../api/ExamApis";
import { toast } from "react-toastify";

const EditExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await getExam(examId);
        setExamData(data.exam);
      } catch (error) {
        toast.error("Failed to load exam.");
      }
    };

    fetchExam();
  }, [examId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index][field] = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleUpdateExam = async () => {
    if (!examData.title.trim()) return toast.error("Exam title is required.");
    if (examData.questions.length === 0) return toast.error("At least one question is required.");

    try {
      await editExam(examId, examData);
      toast.success("Exam updated successfully!");
      navigate(-1); // Go back to previous page
    } catch (error) {
      toast.error("Failed to update exam.");
    }
  };

  if (!examData) return <p>Loading exam...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Edit Exam</h1>
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
        onChange={(e) => setExamData({ ...examData, description: e.target.value })}
        className="w-full p-2 border rounded-md mb-3"
      />

      <h2 className="text-lg font-semibold">Edit Questions</h2>
      <ul className="list-disc pl-4">
        {examData.questions.map((q, index) => (
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

      <button onClick={handleUpdateExam} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
        Save Changes
      </button>
    </div>
  );
};

export default EditExamPage;
