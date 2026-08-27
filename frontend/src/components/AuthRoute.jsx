import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth.js";
export default function AuthRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        console.log("not logged in. redirecting to login page");
        return (
            <Navigate
                to="/Signin"
                replace
            />
        );
    }

    return <Outlet />;
}
