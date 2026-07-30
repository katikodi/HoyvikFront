import { Link } from "react-router-dom";

export default function AdminBar() {
    return (
        <div
            className="nav-bar"
            style={{ border: "1px solid white" }}
        >
            <div>
                <Link to="/">Home/logo</Link>
            </div>
            <div>
                <Link to="booking">Admin</Link>
                <Link to="events">Admin</Link>
                <Link to="aboutus">Om Admin</Link>
            </div>
            <div>
                <p>Admin bar!!</p>
            </div>
        </div>
    );
}
