import { useAuth } from "@/auth/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return (
        <div>
            <Link to="/">🡠Home</Link>
            <h1>{user.email}</h1>
            <h2>Roles:</h2>
            <ul>
                {user.roles.map((role, index) => {
                    return <li key={index}>{role}</li>;
                })}
            </ul>

            <button onClick={logout}>Logout</button>
        </div>
    );
}
