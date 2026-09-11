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
        <div className="flex min-h-dvh flex-col">
            <header className="border-b">
                <nav className="flex items-center gap-4 overflow-x-auto p-4 *:whitespace-nowrap *:[&.active]:font-bold">
                    <Link to="/">Home</Link>

                    <Link to="/about">About</Link>

                    <Link to="/profile">Profile</Link>

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

            <main className="flex min-w-0 flex-1 p-3">
                <Outlet />
            </main>
        </div>
    );
}
