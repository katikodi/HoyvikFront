import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    async function handleLogout() {
        await logout();
        navigate({ to: "/" });
    }

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
                        to="/about"
                        className="[&.active]:font-bold"
                    >
                        About
                    </Link>

                    <Link
                        to="/profile"
                        className="[&.active]:font-bold"
                    >
                        Profile
                    </Link>
                    {user ? (
                        <Button onClick={handleLogout}>Logout</Button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="flex flex-1 p-3">
                <Outlet />
            </main>
        </div>
    );
}
