import { useAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
    const { user } = useAuth();

    return <p>{user.email}</p>;
}
