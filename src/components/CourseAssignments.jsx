import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAssignment,
  getAssignments,
  submitAssignment,
  resubmitAssignment,
  deleteAssignment,
} from "../api/AssignmentApis";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const CourseAssignments = ({ courseId }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments(courseId);
        setAssignments(data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [courseId]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await createAssignment(courseId, newAssignment);
      toast.success("Assignment created successfully!");
      setNewAssignment({ title: "", description: "", dueDate: "" });

      const data = await getAssignments(courseId);
      setAssignments(data.assignments || []);
    } catch (error) {
      toast.error("Failed to create assignment.");
    }
  };

  const handleFileChange = (assignmentId, file) => {
    setSelectedFiles({ ...selectedFiles, [assignmentId]: file });
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await submitAssignment(assignmentId, formData);
      toast.success("Assignment submitted successfully!");
      setSelectedFiles({ ...selectedFiles, [assignmentId]: null });

      const data = await getAssignments(courseId);
      setAssignments(data.assignments || []);
    } catch (error) {
      toast.error("Failed to submit assignment.");
    }
  };

  const handleResubmitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await resubmitAssignment(assignmentId, formData);
      toast.success("Assignment resubmitted successfully!");

      const data = await getAssignments(courseId);
      setAssignments(data.assignments || []);
    } catch (error) {
      toast.error("Failed to resubmit assignment.");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await deleteAssignment(assignmentId);
      toast.success("Assignment deleted successfully!");

      const data = await getAssignments(courseId);
      setAssignments(data.assignments || []);
    } catch (error) {
      toast.error("Failed to delete assignment.");
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Assignments</h2>

      {/* Teachers can create assignments */}
      {auth.role === "teacher" && (
        <form
          onSubmit={handleCreateAssignment}
          className="mt-4 p-4 bg-gray-100 rounded-md"
        >
          <input
            type="text"
            placeholder="Title"
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({
                ...newAssignment,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded-md mt-2"
          />
          <input
            type="date"
            value={newAssignment.dueDate}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, dueDate: e.target.value })
            }
            className="w-full p-2 border rounded-md mt-2"
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create Assignment
          </button>
        </form>
      )}

      {/* List of Assignments */}
      <ul className="mt-4 space-y-3">
        {assignments.map((assignment) => (
          <li
            key={assignment._id}
            className="p-3 bg-white shadow rounded-md flex flex-col space-y-2"
          >
            <div>
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p className="text-gray-500">{assignment.description}</p>
              <p className="text-sm text-gray-400">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              {auth.role === "student" && (
                <p
                  className={`text-sm font-medium ${
                    assignment.submitted ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {assignment.submitted ? "Submitted" : "Pending"}
                </p>
              )}
              {auth.role === "student" && assignment.grade && (
                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-sm font-semibold text-blue-600">
                    Grade: {assignment.grade}%
                  </p>
                  <p className="text-sm text-gray-700">
                    Feedback: {assignment.feedback || "No feedback provided."}
                  </p>
                </div>
              )}
            </div>

            {/* Students can submit assignments */}
            {auth.role === "student" && !assignment.submitted && (
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(assignment._id, e.target.files[0])
                  }
                  className="p-2 border rounded-md"
                />
                <button
                  onClick={() => handleSubmitAssignment(assignment._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                >
                  Submit Assignment
                </button>
              </div>
            )}

            {/* Students can resubmit before grading */}
            {auth.role === "student" && assignment.submitted && !assignment.grade && (
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(assignment._id, e.target.files[0])}
                  className="p-2 border rounded-md"
                />
                <button
                  onClick={() => handleResubmitAssignment(assignment._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Resubmit Assignment
                </button>
              </div>
            )}

            {/* Teachers can view submissions or delete assignments */}
            {auth.role === "teacher" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/assignments/${assignment._id}/submissions`)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  View Submissions
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseAssignments;
