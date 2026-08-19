import "@/styles/Nav.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Nav = () => {
    const { isAdmin, user } = useAuth();

    return (
        <nav className="nav">
            <NavLogo />
            <div className="nav-links-container">
                <NavLink to="/Booking">Booking</NavLink>

                {user ? (
                    <>
                        <NavLink to="/profile">Profile</NavLink>
                        <NavLink to="/signout">Sign out</NavLink>
                    </>
                ) : (
                    <NavLink to="/signin">Sign in</NavLink>
                )}
                {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            </div>
            <NavLogo />
        </nav>
    );
};

export default Nav;

const NavLogo = () => {
    return <NavLink to={"/"}>HOME</NavLink>;
};
