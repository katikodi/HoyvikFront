import { Link, Outlet, useLocation } from "@tanstack/react-router";

export default function MainLayout() {
    const location = useLocation();

    const navLinks = [
        { to: "/", text: "Home" },
        { to: "/activities", text: "Activities" },
        { to: "/about", text: "About" },
        { to: "/contact", text: "Contact Us" },
        { to: "/shop", text: "Shop" }
    ];

    const isHome = location.pathname === "/";

    return (
        <div className="flex min-h-dvh w-full flex-col">
            {/* Header does not belong inside of main */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex w-full items-center justify-around gap-4 p-4">
                    {navLinks.map(({ to, text }) => (
                        <Link
                            to={to}
                            key={to}
                            className="font-serif text-[#B8CBBE]"
                        >
                            {text}
                        </Link>
                    ))}
                </nav>
            </header>

            <main className={`min-w-0 w-full flex-1 ${isHome ? "" : "pt-20"}`}>
                <Outlet />
            </main>
        </div>
    );
}
