import "@/styles/Nav.css";
const Nav = () => {
    return (
        <nav className="nav">
            {/* THESE LINK DESTINATIONS ARE TEMPORARY */}
            <NavLogo />
            <div className="nav-links-container">
                <NavLink
                    text="SignIn"
                    linkDestination="/signin"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
                <NavLink
                    text="Rom"
                    linkDestination="/Booking"
                />
            </div>
            <NavLogo />
        </nav>
    );
};

export default Nav;

const NavLink = ({ text, linkDestination }) => {
    // TODO: figure out if these have a hover effect
    // TODO: should these use react router Link instead of a?
    return (
        <a
            href={linkDestination}
            className="cinzel nav-link"
        >
            {text}
        </a>
    );
};

const NavLogo = () => {
    return (
        <NavLink
            text="HOME"
            linkDestination="/"
        />
    );
};
