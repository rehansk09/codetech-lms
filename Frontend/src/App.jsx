import Pricing from './pages/Pricing';
import CourseDetails from './pages/CourseDetails';
import CourseExplore from './pages/CourseExplore';
import Home from './pages/Home.jsx';
import Playground from './pages/Playground';
import { useEffect, useState } from 'react';
import MainLayout from './component/MainLayout';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './pages/instructor/Dashboard';
import Sidebar from './pages/instructor/Sidebar';
import CourseTable from './pages/instructor/CourseTable';
import AddCourse from './pages/instructor/AddCourse';
import AddLesson from './pages/instructor/AddLesson';
import LecturePage from './pages/LecturePage';
import RoleSelection from './pages/RoleSelection';
import UserDashboard from './pages/User/UserDashboard';
import UserSidebar from './pages/User/UserSidebar';
import MyLearning from './pages/User/MyLearning';
import Login from './pages/login';
import Register from './pages/Register';
import Sidebar2 from './pages/admin/Sidebar2';
import { Instructor } from './pages/admin/Instructor';
import { AllUser } from './pages/admin/AllUser';
import { InstructorInfo } from './pages/admin/InstructorInfo';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import QuestionForm from './pages/instructor/QuestionForm';
import Quiz from './pages/Quiz';
import Certificate from './pages/User/Certificate';
import { Room } from './pages/instructor/Room';
import MeetingsPage from './pages/instructor/MeetingsPage';
import { ToastContainer } from 'react-toastify';
import RoleRoute from './utils/RoleRoute';
import ProfilePage from './pages/ProfilePage';
import PwaUpdatePrompt from './component/PwaUpdatePrompt';
import LaunchLoader from './component/LaunchLoader';
import CustomCursor from './component/CustomCursor';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "role-selection",
        element: <RoleSelection />,
      },
      {
        path: "course/:courseId/quiztest",
        element: <Quiz />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "playground",
        element: <Playground />,
      },
      {
        path: "courseexplore",
        element: <CourseExplore />,
      },
      {
        path: "certificate/:userId/:courseId",
        element: <Certificate />,
      },
      {
        path: "course-detail/:courseId",
        element: <CourseDetails />,
      },
      {
        path: "course-progress/:courseId",
        element: <LecturePage />,
      },
      {
        path: "profile",
        element: <RoleRoute roles={["student", "instructor"]}><ProfilePage /></RoleRoute>,
      },
      // Instructor Routes
      {
        path: "instructor",
        element: <RoleRoute roles={["instructor"]}><Sidebar /></RoleRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course/meeting",
            element: <MeetingsPage />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <AddCourse />,
          },
          {
            path: "course/:courseId/add_lessons",
            element: <AddLesson />,
          },
          {
            path: "course/:courseId/addquestions",
            element: <QuestionForm />,
          },
          {
            path: "course/edit/:id",
            element: <AddCourse />,
          },
        ],
      },
      // User Routes
      {
        path: "user",
        element: <RoleRoute roles={["student"]}><UserSidebar /></RoleRoute>,
        children: [
          {
            path: "dashboard",
            element: <UserDashboard />,
          },
          {
            path: "my-learning",
            element: <MyLearning />,
          },
        ],
      },
      // Admin Routes
      {
        path: "admin",
        element: <RoleRoute roles={["admin"]}><Sidebar2 /></RoleRoute>,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "instructor",
            element: <Instructor />,
          },
          {
            path: "allusers",
            element: <AllUser />,
          },
          {
            path: "instructor/:id/course",
            element: <InstructorInfo />,
          },
        ],
      },
    ],
  },
  // Meeting Route (Outside MainLayout to remove nav)
  {
    path: "meeting/:roomID",
    element: <Room />,
  },
]);

function App() {
  const [showLaunchLoader, setShowLaunchLoader] = useState(true);

  useEffect(() => {
    const launchTimer = window.setTimeout(() => {
      setShowLaunchLoader(false);
    }, 3400);

    return () => window.clearTimeout(launchTimer);
  }, []);

  return (
    <main>
      <RouterProvider router={appRouter} />
      <ToastContainer/>
      <PwaUpdatePrompt />
      <CustomCursor />
      {showLaunchLoader && <LaunchLoader />}
    </main>
  );
}

export default App;
