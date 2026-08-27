import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth.js";

export default function AdminRoute() {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <Outlet />;
}
