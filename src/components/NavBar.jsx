import { Link } from "react-router-dom";


export default function NavBar() {

    return (
        <div className="nav-bar" style={{border:"1px solid white"}}>
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