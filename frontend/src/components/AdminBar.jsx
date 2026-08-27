import "@/styles/Nav.css";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth.js";
import Button from "@/components/Button";

const AdminBar = () => {
    const { isAdmin, user } = useAuth();
    return (
        <nav className="nav">
            <NavLogo />
            <div className="flex-row center gap-6">
                <NavLink to="/Booking">Booking</NavLink>
                <NavLink to="/Aktiviteter">Aktiviteter</NavLink>

                <NavLink to="/aboutUs">Om Oss</NavLink>

                <NavLink to="/Kontakt">Kontakt</NavLink>
                <NavLink to="/Nettbutikk">Nettbutikk</NavLink>
            </div>
            <div className="flex-row center gap-1 width-fit-content">
                {isAdmin && (
                    <>
                        <Button onClick={resetDatabase}>Reset Database</Button>
                    </>
                )}
                {user ? (
                    <>
                        <NavLink to="/profile">Profile</NavLink>
                        {/* <NavLink
                            to="/"
                            onClick={logout}
                        >
                            Sign out
                        </NavLink> */}
                    </>
                ) : (
                    <NavLink to="/signin">Sign in</NavLink>
                )}
            </div>
        </nav>
    );
};

//THIS DOES NOT BELONG HERE. just put it here temporary for testing purposes
async function resetDatabase() {
    const response = await fetch("/api/admin/migrate", {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        console.error("something went wrong");
    }
}

const NavLogo = () => {
    return <NavLink to={"/"}>HOME</NavLink>;
};

export default AdminBar;
