import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    async function handleLogout() {
        await logout();
        navigate({ to: "/" });
    }
    const navLinks = [
        { to: "/", text: "Home" },
        { to: "/activities", text: "Activities" },
        { to: "/about", text: "About" },
        { to: "/contact", text: "Contact Us" },
        { to: "/shop", text: "Shop" }
    ];
    const isHome = location.pathname === "/";

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

    return (
        <div className="flex min-h-dvh w-dvw max-w-dvw flex-col">
            <header className="w-full">
                <nav className="fixed bg-transparent flex w-full gap-4 p-4 justify-around items-center">
                    <div className="flex flex-row grow gap-12">
                        {navLinks.map(({ to, text }, i) => (
                            <Link
                                to={to}
                                key={i}
                                className="font-serif text-[#B8CBBE]"
                            >
                                {text}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-row gap-8">
                        {!user &&
                            anonNavLinks.map(({ to, text }, i) => (
                                <Link
                                    to={to}
                                    key={i}
                                    className="font-serif text-[#B8CBBE]"
                                >
                                    {text}
                                </Link>
                            ))}
                    </div>
                    {user && <Button onClick={handleLogout}>Logout</Button>}
                    <div>
                        <ModeToggle />
                    </div>
                </nav>
            </header>
            <main className={`min-w-0 w-full flex-1 ${isHome ? "" : "pt-20"}`}>
                <Outlet />
                <Toaster />
            </main>
        </div>
    );
}
