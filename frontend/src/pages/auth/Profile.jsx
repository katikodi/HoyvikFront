import useAuth from "@/hooks/useAuth.js";
import { Navigate, Link } from "react-router-dom";
import Button from "@/components/Button";
export default function Profile() {
    const { user, logout } = useAuth();
    if (!user) return <Navigate to="/signin" />;

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

            <Link
                to="/"
                onClick={logout}
            >
                <Button>Logout</Button>
            </Link>
        </div>
    );
}
