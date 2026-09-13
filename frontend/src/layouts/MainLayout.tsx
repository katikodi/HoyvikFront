import { ModeToggle } from "@/components/mode-toggle";
import { Link, Outlet } from "@tanstack/react-router";

export default function MainLayout() {
    const navLinks = [
        {
            to: "/",
            text: "Home"
        },
        {
            to: "/activities",
            text: "Activities"
        },
        {
            to: "/about",
            text: "About"
        },
        {
            to: "/contact",
            text: "Contact Us"
        },
        {
            to: "/shop",
            text: "Shop"
        }
    ];

    //the layouts should control the layout and structure of the page, not its children
    return (
        <div className="flex min-h-dvh w-full flex-col">
            {/* header does not belong inside of main */}
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
                    <ModeToggle />
                </nav>
            </header>

            <main className="min-w-0 w-full flex-1">
                <Outlet />
            </main>
        </div>
    );
}
