import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAssignmentSubmissions,
  gradeAssignment,
} from "../api/AssignmentApis";
import { toast } from "react-toastify";

const AssignmentSubmissionsPage = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getAssignmentSubmissions(assignmentId);
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (studentId, value) => {
    setGrades({ ...grades, [studentId]: value });
  };

  const handleFeedbackChange = (studentId, value) => {
    setFeedbacks({ ...feedbacks, [studentId]: value });
  };

  const handleGradeAssignment = async (studentId) => {
    const grade = grades[studentId] || 0;
    const feedback = feedbacks[studentId] || "";

    try {
      await gradeAssignment(assignmentId, studentId, {
        grade: grade,
        feedback: feedback,
      });
      toast.success("Grade submitted successfully!");

      // Refresh submissions after grading
      const data = await getAssignmentSubmissions(assignmentId);
      setSubmissions(data.submissions || []);
    } catch (error) {
      toast.error("Failed to submit grade.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-5">
      <h1 className="text-2xl font-bold text-blue-600">
        Assignment Submissions
      </h1>

      {submissions.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {submissions.map((submission) => (
            <li
              key={submission.studentId._id}
              className="p-3 bg-gray-100 shadow rounded-md"
            >
              <p className="font-medium">
                {submission.studentId.name} ({submission.studentId.email})
              </p>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View Submission
              </a>

              <div className="mt-2 flex flex-col space-y-2">
                <input
                  type="number"
                  placeholder="Grade"
                  min={0}
                  max={100}
                  value={grades[submission.studentId._id] || ""}
                  onChange={(e) =>
                    handleGradeChange(submission.studentId._id, e.target.value)
                  }
                  className="p-2 border rounded-md w-24"
                />
                <textarea
                  placeholder="Enter feedback..."
                  value={feedbacks[submission.studentId._id] || ""}
                  onChange={(e) =>
                    handleFeedbackChange(
                      submission.studentId._id,
                      e.target.value
                    )
                  }
                  className="p-2 border rounded-md w-full"
                />
                <button
                  onClick={() =>
                    handleGradeAssignment(submission.studentId._id)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                >
                  Submit Grade & Feedback
                </button>
              </div>

              {submission.grade !== null && (
                <p className="text-green-500 text-sm mt-1">
                  Graded: {submission.grade} - {submission.feedback}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No submissions yet.</p>
      )}
    </div>
  );
};

export default AssignmentSubmissionsPage;
