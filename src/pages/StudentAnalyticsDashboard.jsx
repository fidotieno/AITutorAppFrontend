import { useEffect, useState } from "react";
import { getStudentAnalytics } from "../api/AnalyticsApis";
import { useAuth } from "../auth/AuthProvider";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = ({ studentCode }) => {
  const auth = useAuth();
  const studentId = studentCode || auth.userId;
  const [student, setStudent] = useState(null);
  const [overallPerformance, setOverallPerformance] = useState(null);
  const [coursePerformance, setCoursePerformance] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getStudentAnalytics(studentId);
        const data = await response.json();

        setStudent(data.modifiedStudent);
        setOverallPerformance(data.overallPerformance);
        setCoursePerformance(data.coursePerformance);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!student || !overallPerformance) {
    return <div className="text-center text-gray-500 p-6">Loading...</div>;
  }

  // Chart Data
  const chartData = {
    labels: ["Quizzes", "Exams", "Assignments"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [
          overallPerformance.quizAverage ?? 0,
          overallPerformance.examAverage ?? 0,
          overallPerformance.assignmentAverage ?? 0,
        ],
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981"],
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Student Info */}
      <div className="flex items-center bg-blue-100 p-4 rounded-lg mb-6 shadow-md">
        <img
          src={student.profilePhoto?.url || "/default-profile.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
        />
        <div>
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-gray-600">{student.email}</p>
        </div>
      </div>

      {/* Overall Performance */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          📊 Overall Performance
        </h2>

        {/* Chart for Average Scores */}
        <Bar data={chartData} />

        {/* Performance Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <p className="font-semibold">
            Total Quizzes:{" "}
            <span className="text-blue-500">
              {overallPerformance.totalQuizzes}
            </span>
          </p>
          <p className="font-semibold">
            Total Exams:{" "}
            <span className="text-red-500">
              {overallPerformance.totalExams}
            </span>
          </p>
          <p className="font-semibold">
            Total Assignments:{" "}
            <span className="text-green-500">
              {overallPerformance.totalAssignments}
            </span>
          </p>
          <p className="font-bold text-gray-800">
            Overall Average Score:{" "}
            <span className="text-blue-600">
              {overallPerformance.averageScore ?? "N/A"}%
            </span>
          </p>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-green-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3 text-green-700">
          📚 Course Performance
        </h2>
        {coursePerformance.length > 0 ? (
          <ul>
            {coursePerformance.map((course) => (
              <li key={course.courseId} className="border-b py-3">
                <p className="font-semibold text-lg text-gray-700">
                  {course.courseName}
                </p>

                {/* Progress Bars */}
                <div className="mt-2">
                  <p className="text-gray-600">
                    Quiz Scores: {course.quizScores.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.quizAverage ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-gray-600">
                    Exam Scores: {course.examScores.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${course.examAverage ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-gray-600">
                    Assignment Scores: {course.assignmentScores.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${course.assignmentAverage ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-gray-800 font-bold mt-3">
                  Overall Course Score:{" "}
                  <span className="text-green-700">
                    {course.averageScore ?? "N/A"}%
                  </span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No course performance data available.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
