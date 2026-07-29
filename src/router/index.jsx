import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Events from "../pages/Events";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../components/NotFound";
import AboutUs from "../pages/AboutUs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "booking", element: <Booking /> },
            { path: "events", element: <Events /> },
            { path: "aboutus", element: <AboutUs /> },
        ],
    },
    { path: "*", element: <NotFound /> },
]);
