import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
    const { user } = useAuth();

    if (!user) {
        return <p>Login</p>;
    }
    return <Navigate to="/" />;
}
