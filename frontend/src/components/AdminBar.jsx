import {NavLink } from "react-router-dom";

export default function AdminBar() {
    return (
        <div
            className="nav-bar"
            style={{ border: "1px solid white" }}
        >
            <div>
                <NavLink to="/">Home/logo</NavLink>
            </div>
            <div>
                <NavLink to="booking">Admin</NavLink>
                <NavLink to="events">Admin</NavLink>
                <NavLink to="aboutus">Om Admin</NavLink>
            </div>
            <div>
                <p>Admin bar!!</p>
            </div>
        </div>
    );
}
