import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import AuthLayout from "./layouts/AuthLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./auth/ProtectRoute";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EditProfilePage from "./pages/EditProfilePage";
import ViewProfilePage from "./pages/ViewProfilePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import EditCoursePage from "./pages/EditCoursePage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import TakeQuizPage from "./pages/TakeQuizPage";
import TeacherQuizViewPage from "./pages/TeacherQuizViewPage";
import StudentViewQuizResultsPage from "./pages/StudentViewQuizResultsPage";
import courseLoader from "./loaders/courseLoader";
import AssignmentSubmissionsPage from "./pages/AssignmentSubmissionsPage";
import StudentAnalyticsDashboardPage from "./pages/StudentAnalyticsDashboard";
import UnapprovedPage from "./pages/UnapprovedPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:id" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route path="/unapproved" element={<UnapprovedPage />} />
          <Route element={<PrivateRoute />}>
            <Route index element={<HomePage />} loader={courseLoader} />
            <Route path="/view-profile" element={<ViewProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route
              path="/all-courses"
              element={<AllCoursesPage />}
              loader={courseLoader}
            />
            <Route path="/create-course" element={<CreateCoursePage />} />
            <Route path="/view-course/:id" element={<CourseDetailsPage />} />
            <Route path="/edit-course/:id" element={<EditCoursePage />} />
            <Route
              path="/assignments/:assignmentId/submissions"
              element={<AssignmentSubmissionsPage />}
            />
          </Route>
          <Route
            path="/quizzes/create/:courseId"
            element={<CreateQuizPage />}
          />
          <Route path="/quizzes/edit/:quizId" element={<EditQuizPage />} />
          <Route path="/quizzes/take/:quizId" element={<TakeQuizPage />} />
          <Route
            path="/quizzes/grade/:quizId"
            element={<TeacherQuizViewPage />}
          />
          <Route
            path="/quizzes/view/:quizId"
            element={<StudentViewQuizResultsPage />}
          />
          <Route
            path="/student/analytics"
            element={<StudentAnalyticsDashboardPage />}
          />
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
