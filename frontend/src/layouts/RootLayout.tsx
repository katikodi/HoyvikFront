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
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/authContext";
import { StrictMode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// import { Menu } from "lucide-react";
import { MainLayoutMobileSidebar } from "@/components/MainLayoutMobileSidebar";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenu } from "@/components/ui/sidebar";
const navLinks = [
    { to: "/", text: "Home" },
    { to: "/activities", text: "Activities" },
    { to: "/about", text: "About" },
    { to: "/contact", text: "Contact Us" },
    { to: "/shop", text: "Shop" },
    { to: "/booking", text: "Booking" },
    { to: "/utleige-diverse", text: "Utleige diverse" }
];
export default function RootLayout() {
    //REMOVE THIS LATER, its for testing purposes only
    const isMobile = useIsMobile();
    const { logout } = useAuth();

    const context = useRouterState({
        select: state => state.matches[0]?.context
    });

    const user = context?.user;

    if (!user || !user?.roles.includes("admin")) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <h1 className="text-2xl font-bold">Under construction</h1>
            </div>
        );
    }
    return (
        <StrictMode>
            <Outlet />
            <TanStackRouterDevtools />
            {!isMobile && <HamburgerDropdown />}
            {isMobile && (
                <MainLayoutMobileSidebar
                    myAccount={
                        <SidebarMenu>
                            {user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/profile"
                                            preload="render"
                                            className="font-sans text-[#B8CBBE] h-9 content-center cursor-pointer"
                                        >
                                            Profile
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            preload="render"
                                            to="/profile"
                                            className="font-sans text-[#B8CBBE] h-9 content-center cursor-pointer"
                                        >
                                            My Bookings
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        className="font-sans text-[#B8CBBE] h-9 content-center cursor-pointer"
                                        onClick={() => logout()}
                                    >
                                        Logout
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {!user && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            preload="render"

                                            className="font-sans text-[#B8CBBE] h-9 content-center cursor-pointer"
                                            to="/login"
                                        >
                                            Login
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    }
                    navLinks={navLinks.map(({ to, text }, i) => (
                        <SidebarMenuItem key={i}>
                            <SidebarMenuButton asChild>
                                <Link
                                    preload="render"
                                    to={to}
                                    className="font-sans text-[#B8CBBE] h-9 content-center"
                                >
                                    {text}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                >
                    <Outlet />
                </MainLayoutMobileSidebar>
            )}
            ;
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
