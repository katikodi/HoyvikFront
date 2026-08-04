import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import Events from "@/pages/Events";
import Admin from "@/pages/Admin";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import NotFound from "@/components/NotFound";
import AboutUs from "@/pages/AboutUs";
import AuthRoute from "@/components/AuthRoute";
import AdminRoute from "@/components/AdminRoute";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/auth/Profile";

export const router = createBrowserRouter([
    //any user
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "booking", element: <Booking /> },
            { path: "events", element: <Events /> },
            { path: "aboutus", element: <AboutUs /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register/>}
        ]
    },
    //Logged-in Users
    {
        element: <AuthRoute />,
        children: [
            {
                path: "/profile",
                element: <Profile />
            }
        ]
    },
    //admin only
    {
        element: <AdminRoute />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [{ index: true, element: <Admin /> }]
            }
        ]
    },
    { path: "*", element: <NotFound /> }
]);
