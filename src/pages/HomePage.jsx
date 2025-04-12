import { useAuth } from "../auth/AuthProvider";
import StudentDashboard from "./StudentDashboardPage";
import TeacherDashboard from "./TeacherDashboardPage";
import ParentDashboard from "./ParentDashboardPage";
import NotLoggedInCard from "../components/NotLoggedInCard";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const auth = useAuth();
  const courseData = useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      {!auth.token ? (
        <NotLoggedInCard />
      ) : auth.role === "student" ? (
        <StudentDashboard courses={courseData} />
      ) : auth.role === "teacher" ? (
        <TeacherDashboard />
      ) : auth.role === "parent" ? (
        <ParentDashboard />
      ) : (
        <div className="text-center mt-10 text-gray-600">Invalid role</div>
      )}
    </div>
  );
};

export default HomePage;
