import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Home from "./features/interview/pages/Home.jsx"
import ReportsList from "./features/interview/pages/ReportsList.jsx"
import Protected from "./features/auth/components/protected.jsx"
import Interview from "./features/interview/pages/interview.jsx"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/reports",
        element: <Protected><ReportsList /></Protected>
    }
]);