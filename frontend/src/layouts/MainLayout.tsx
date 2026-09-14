import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/authContext";

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
                <nav className="flex w-full items-center justify-around gap-4 p-4 pr-24 bg-background/90">
                    {navLinks.map(({ to, text }) => (
                        <Link
                            to={to}
                            key={to}
                            className="font-serif text-[#B8CBBE] h-9 content-center"
                        >
                            {text}
                        </Link>
                    ))}
                </nav>
                <HamburgerDropdown />
            </header>

            <main className={`min-w-0 w-full flex-1 ${isHome ? "" : "pt-20"}`}>
                <Outlet />
            </main>
        </div>
    );
}

function HamburgerDropdown() {
    const { setTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed right-4 top-4 z-50 rounded-none"
                >
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="rounded-none">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>

                    <DropdownMenuItem asChild>
                        <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user ? (
                        <>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">My Bookings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => logout()}
                                className="cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem
                                onClick={() => logout()}
                                className="cursor-pointer"
                            >
                                <Link to="/login">Login</Link>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
