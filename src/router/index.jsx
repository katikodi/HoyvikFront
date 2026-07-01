import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Events from "../pages/Events";

export const router = createBrowserRouter([
    { path: "/", element: <App/>, children: [
        { index: true, element: <Home/> },
        { path: "booking", element: <Booking/> },
        { path: "events", element: <Events/> }
    ]},
    { path: "*", element: <h1>404 Not Found</h1> }
]);