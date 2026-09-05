import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
    component: MainLayout
});

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    async function handleLogout() {
        await logout();
        navigate({ to: "/" });
    }

    return (
        <div>
            <header>
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

            <main>
                <Outlet />
            </main>
        </div>
    );
}
