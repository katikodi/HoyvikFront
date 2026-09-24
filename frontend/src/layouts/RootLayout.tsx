import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/authContext";
import { StrictMode } from "react";
export default function RootLayout() {
    return (
        <StrictMode>
            <Outlet />
            <TanStackRouterDevtools />
            <HamburgerDropdown />
        </StrictMode>
    );
}
function HamburgerDropdown() {
    const { setTheme } = useTheme();
    const { user, logout } = useAuth();

    const navigation = useNavigate();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed right-4 top-4 z-50 rounded-none bg-background"
                >
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="rounded-none">
                {user?.roles.includes("admin") && (
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Admin</DropdownMenuLabel>
                        <DropdownMenuItemLink to="/admin">Admin Page</DropdownMenuItemLink>
                        <DropdownMenuItemLink to="/dashboard">Dashboard</DropdownMenuItemLink>
                    </DropdownMenuGroup>
                )}
                <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItemLink to="/profile">Profile</DropdownMenuItemLink>
                    {user ? (
                        <>
                            <DropdownMenuItemLink to="/profile">My Bookings</DropdownMenuItemLink>
                            <DropdownMenuItem
                                onClick={async () => {
                                    await logout();
                                    navigation({ to: "/", reloadDocument: true });
                                }}
                                className="cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItemLink to="/login">Login</DropdownMenuItemLink>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("light")}
                    >
                        Light
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("dark")}
                    >
                        Dark
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("system")}
                    >
                        System
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DropdownMenuItemLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <DropdownMenuItem
            className="cursor-pointer"
            asChild
        >
            <Link to={to}>{children}</Link>
        </DropdownMenuItem>
    );
}
