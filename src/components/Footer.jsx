export default function Footer() {
    return (
        <div className="footer">
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