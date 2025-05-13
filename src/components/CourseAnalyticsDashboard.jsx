import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getCourseAnalytics } from "../api/AnalyticsApis";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CourseAnalyticsDashboard = ({ courseId }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getCourseAnalytics(courseId);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching course analytics:", error);
      }
    };

    fetchAnalytics();
  }, [courseId]);

  if (!analytics) {
    return <p>Loading course analytics...</p>;
  }

  const barData = {
    labels: ["Quizzes", "Assignments", "Overall"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [
          analytics.classStats.averageQuizScore,
          analytics.classStats.averageAssignmentScore,
          analytics.classStats.averageOverallScore,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        📊 Course Analytics
      </h2>

      <Bar data={barData} />

      <h3 className="text-xl mt-6 mb-2 font-semibold text-gray-700">
        Student Performance Breakdown
      </h3>
      <ul className="space-y-3 mt-4">
        {analytics.studentBreakdown.map((student) => (
          <li key={student.studentId} className="border p-3 rounded-md">
            <p className="font-bold">Student Name: {student.studentName}</p>
            <p className="font-bold">Email Address: {student.studentEmail}</p>
            <p>Quiz Avg: {student.quizAverage.toFixed(1)}%</p>
            <p>Assignment Avg: {student.assignmentAverage.toFixed(1)}%</p>
            <p className="font-semibold">
              Overall: {student.overallAverage.toFixed(1)}%
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseAnalyticsDashboard;
