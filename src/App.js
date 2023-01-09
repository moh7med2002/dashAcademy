import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import Main from "./Main";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Courses from "./pages/Courses";
import Units from "./pages/Units";
import Lessons from "./pages/Lessons";
import Subjects from "./pages/Subjects";
import Exams from './pages/Exams'
import Questions from './pages/Questions'
import Login from "./pages/Login";
import Wallets from "./pages/Wallets";
import StudentWallet from "./pages/StudentWallet";
import Students from "./pages/Students";
import Student from "./pages/Student";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import GroupLessons from "./pages/GroupLessons";
import GroupStudents from "./pages/GroupStudents";
import CheckLessons from "./pages/CheckLessons";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {

  const {currentUser} = useSelector((state)=>state.admin)

  const router = createBrowserRouter([
    {
      path: "/",
      element: currentUser?<Main/>:<Navigate to="/login"/>,
      errorElement: <h1 sx={{textAlign: 'center'}}>Page not found 404</h1>,
      children: [
        {
          index: true,
          element: currentUser?<Courses/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses',
          element: currentUser?<Courses/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId/unit/:unitId/exams',
          element: currentUser?<Exams/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId',
          element: currentUser?<Units/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId/:UnitId',
          element: currentUser?<Lessons/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId/:UnitId',
          element: currentUser?<Lessons/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId/checkLessons/:UnitId',
          element: currentUser?<CheckLessons/>:<Navigate to="/login"/>,
        },
        {
          path: 'courses/:CourseId/unit/:unitId/exams/:examId/questions',
          element: currentUser?<Questions/>:<Navigate to="/login"/>,
        },
        {
          path: 'subjects',
          element: currentUser?<Subjects/>:<Navigate to="/login"/>,
        },
        {
          path: 'wallets',
          element: currentUser?<Wallets/>:<Navigate to="/login"/>,
        },
        {
          path: 'students/view/:studentId',
          element: currentUser?<Student/>:<Navigate to="/login"/>,
        },
        {
          path: 'students',
          element: currentUser?<Students/>:<Navigate to="/login"/>,
        },
        {
          path: 'wallets/:id',
          element: currentUser?<StudentWallet/>:<Navigate to="/login"/>,
        },
        {
          path:'groups',
          element : currentUser?<Groups/>:<Navigate to="/login"/>,
        },
        {
          path:'groups/:id',
          element : currentUser?<Group/>:<Navigate to="/login"/>,
        },
        {
          path:'groups/:id/lessons',
          element: currentUser?<GroupLessons/>:<Navigate to="/login"/>
        },
        {
          path:'groups/:id/students',
          element:currentUser?<GroupStudents/>:<Navigate to="/login"/>
        },
        {
          path: '*',
          element: <h1>Page not found 404</h1>,
        },
      ]
    },
    {
      path:"/login",
      element:!currentUser?<Login/>:<Main/>
    }
  ]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
