import "@/styles/Nav.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
const Nav = () => {
    const { isAdmin } = useAuth();

    return (
        <nav className="nav">
            {/* THESE LINK DESTINATIONS ARE TEMPORARY */}
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

// const NavLink = ({ text, linkDestination }) => {
//     // TODO: figure out if these have a hover effect
//     // TODO: should these use react router Link instead of a?
//     return (
//         <a
//             href={linkDestination}
//             className="cinzel nav-link"
//         >
//             {text}
//         </a>
//     );
// };

const NavLogo = () => {
    return <NavLink to={"/"}>HOME</NavLink>;
};
