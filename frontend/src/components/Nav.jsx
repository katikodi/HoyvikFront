import "@/styles/Nav.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Nav = () => {
    const { isAdmin } = useAuth();

    return (
        <nav className="nav">
            <NavLogo />
            <div className="nav-links-container">
                <NavLink to="/signin">Sign in</NavLink>

                {isAdmin && <NavLink to="/admin">Admin</NavLink>}

                <NavLink to="/Booking">Rom</NavLink>
            </div>
            <NavLogo />
        </nav>
    );
};

export default Nav;

const NavLogo = () => {
    return <NavLink to={"/"}>HOME</NavLink>;
};
