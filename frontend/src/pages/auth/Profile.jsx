import { useAuth } from "@/auth/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log(user);

    if (!user) {
        return <Navigate to="/Signin" />;
    }

    return (
        <div>
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
