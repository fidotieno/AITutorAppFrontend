import { useAuth } from "../auth/AuthProvider";
import StudentDashboard from "./StudentDashboardPage";
import TeacherDashboard from "./TeacherDashboardPage";
import NotLoggedInCard from "../components/NotLoggedInCard";
import { useLoaderData } from "react-router-dom";

const HomePage = () => {
  const auth = useAuth();
  const courseData = useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      {!auth.token ? (
        <NotLoggedInCard />
      ) : (
        <>
          {auth.role === "student" ? (
            <StudentDashboard courses = {courseData}/>
          ) : (
            <TeacherDashboard />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
