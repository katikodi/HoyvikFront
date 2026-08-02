import { useAuth } from "@/auth/AuthContext";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const { isAdmin } = useAuth();
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
            </div>

            {isAdmin && (
                <div>
                    <NavLink to="admin">Admin</NavLink>
                </div>
            )}
        </div>
    );
}
