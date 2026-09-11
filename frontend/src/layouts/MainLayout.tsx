import { ModeToggle } from "@/components/mode-toggle";
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

    const navLinks = [
        {
            to: "/",
            text: "Home"
        },
        {
            to: "/about",
            text: "About"
        },
        {
            to: "/profile",
            text: "Profile"
        },
        {
            to: "/",
            text: "Home"
        }
    ];

    const anonNavLinks = [
        {
            to: "/login",
            text: "Login"
        },
        {
            to: "/register",
            text: "Register"
        }
    ];

    const allLinks = user ? navLinks : [...navLinks, ...anonNavLinks];

    return (
        <>
            <main className="h-dvh">
                <header className="w-dvw">
                    <nav className="absolute bg-transparent flex w-full max-w-100% gap-4 p-4 justify-around">
                        {allLinks.map(({ to, text }, i) => (
                            <Link
                                to={to}
                                key={i}
                                className="font-serif text-[#B8CBBE]"
                            >
                                {text}
                            </Link>
                        ))}

                        {user && <Button onClick={handleLogout}>Logout</Button>}
                        <ModeToggle />
                    </nav>
                </header>
                <Outlet />
            </main>
        </>
    );
}
