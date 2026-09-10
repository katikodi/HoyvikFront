// import { useAuth } from "@/hooks/authContext";
import { Link, Outlet } from "@tanstack/react-router";

export default function ProfileLayout() {
    return (
        <div className="min-h-dvh flex flex-col">
            <header className="border-b">
                <nav className="flex gap-4 p-4">
                    <Link
                        to="/"
                        className="[&.active]:font-bold"
                    >
                        Home
                    </Link>
                    <Link
                        to="/profile"
                        className="[&.active]:font-bold"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/profile/bookings"
                        className="[&.active]:font-bold"
                    >
                        Bookings
                    </Link>
                </nav>
            </header>

            <main className="flex flex-1 p-2">
                <Outlet />
            </main>
        </div>
    );
}
