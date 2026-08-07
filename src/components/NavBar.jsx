import { useAuth } from "@/auth/AuthContext";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const { isAdmin, user, logout } = useAuth();
    return (
        <div
            className="nav-bar"
            style={{ border: "1px solid white" }}
        >
            <div>
                <NavLink to="/">Home/logo</NavLink>
            </div>
            <div>
                <NavLink to="booking">Booking</NavLink>
                <NavLink to="events">Events</NavLink>
                <NavLink to="aboutus">Om Oss</NavLink>
                <NavLink to="signup">Sign Up</NavLink>
            </div>

            {user ? (
                <>
                    <NavLink to={"/profile"}>Profile</NavLink>
                    <NavLink onClick={logout}>Logout</NavLink>
                </>
            ) : (
                <>
                    <NavLink to={"/login"}>Login</NavLink>
                </>
            )}

            {isAdmin && (
                <div>
                    <NavLink to="admin">Admin</NavLink>
                </div>
            )}
        </div>
    );
}
