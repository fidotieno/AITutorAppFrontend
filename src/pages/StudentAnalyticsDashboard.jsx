import { useEffect, useState } from "react";
import { getStudentAnalytics } from "../api/AnalyticsApis";
import { useAuth } from "../auth/AuthProvider";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
};

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

        setStudent(data.student);
        setOverallPerformance(data.overallPerformance);
        setCoursePerformance(data.coursePerformance);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [studentId]);

  if (!student || !overallPerformance) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-300 border-dashed rounded-full animate-spin border-t-blue-600"></div>
      </div>
    );
  }

  const chartData = {
    labels: ["Quizzes", "Assignments"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [
          overallPerformance.quizAverage ?? 0,
          overallPerformance.assignmentAverage ?? 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
    ],
  };

  const pieData = {
    labels: ["Quizzes", "Assignments"],
    datasets: [
      {
        data: [
          overallPerformance.totalQuizzes,
          overallPerformance.totalAssignments,
        ],
        backgroundColor: ["#3b82f6", "#10b981"],
        hoverOffset: 8,
      },
    ],
  };

  const getPerformanceBadge = (score) => {
    if (score >= 85)
      return <span className="text-green-600 font-bold">Excellent</span>;
    if (score >= 70)
      return <span className="text-yellow-600 font-semibold">Good</span>;
    if (score > 0)
      return (
        <span className="text-red-600 font-medium">Needs Improvement</span>
      );
    return <span className="text-gray-500">No Data</span>;
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
        <div className="h-64">
          <Bar
            key={`bar-${studentId}`}
            data={chartData}
            options={chartOptions}
          />
        </div>

        {/* Pie Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Activity Distribution
          </h3>
          <div className="h-64 max-w-sm mx-auto">
            <Pie
              key={`pie-${studentId}`}
              data={pieData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <p className="font-semibold">
            Total Quizzes:{" "}
            <span className="text-blue-500">
              {overallPerformance.totalQuizzes}
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
              {overallPerformance.averageScore?.toFixed(1) ?? "N/A"}%
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
                    {course.averageScore?.toFixed(1) ?? "N/A"}%
                  </span>
                </p>
                <p className="mt-1 text-sm">
                  Status: {getPerformanceBadge(course.averageScore)}
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
 