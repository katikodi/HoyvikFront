import { Link } from "react-router-dom";


export default function NavBar() {

    return (
        <div className="nav-bar">
            <div>
                <Link to="/">
                    Home
                </Link>
            </div>
            <div>
                <Link to="booking">
                    Booking
                </Link>
                <Link to="events">
                    Events
                </Link>
            </div>
        </div>
    );
}