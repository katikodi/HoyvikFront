import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
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
import { Link, Outlet } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/authContext";

export default function RootLayout() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            <HamburgerDropdown />
        </>
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
                    className="fixed right-4 top-4 z-50"
                >
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
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
