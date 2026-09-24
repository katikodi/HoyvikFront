import { useTheme } from "@/components/theme-provider";
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
import { useAuth } from "@/hooks/authContext";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MainLayoutMobileSidebar } from "@/components/MainLayoutMobileSidebar";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenu } from "@/components/ui/sidebar";

export default function MainLayout() {
    const { user, logout } = useAuth();
    const isMobile = useIsMobile();
    const location = useLocation();

    const navLinks = [
        { to: "/", text: "Home" },
        { to: "/activities", text: "Activities" },
        { to: "/about", text: "About" },
        { to: "/contact", text: "Contact Us" },
        { to: "/shop", text: "Shop" },
        { to: "/booking", text: "Booking" },
        { to: "/utleige-diverse", text: "Utleige diverse" }
    ];

    const isHome = location.pathname === "/";

    if (isMobile) {
        return (
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
        );
    }

    return (
        <div className="flex h-dvh w-full flex-col">
            {/* Header does not belong inside of main */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="hidden fixed md:flex w-full items-center justify-around gap-4 py-4 pr-16 backdrop-blur-sm bg-background/80">
                    {navLinks.map(({ to, text }) => (
                        <Link
                            preload="render"
                            to={to}
                            key={to}
                            className="font-serif text-[#B8CBBE] h-9 content-center"
                        >
                            {text}
                        </Link>
                    ))}
                </nav>
                {/* <HamburgerDropdown /> */}
            </header>

            <main className={`min-w-0 w-full flex-1 ${isHome ? "" : "pt-20"}`}>
                <Outlet />
            </main>
        </div>
    );
}

// function HamburgerDropdown() {
//     const { setTheme } = useTheme();
//     const { user, logout } = useAuth();

//     return (
//         <DropdownMenu modal={false}>
//             <DropdownMenuTrigger asChild>
//                 <Button
//                     variant="default"
//                     size="icon"
//                     className="fixed right-4 top-4 z-50 rounded-none bg-background"
//                 >
//                     <Menu />
//                     <span className="sr-only">Open menu</span>
//                 </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent className="rounded-none">
//                 {user?.roles.includes("admin") && (
//                     <DropdownMenuGroup>
//                         <DropdownMenuLabel>Admin</DropdownMenuLabel>
//                         <DropdownMenuItem asChild>
//                             <Link to="/admin">Admin Page</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                             <Link to="/dashboard">Dashboard</Link>
//                         </DropdownMenuItem>
//                     </DropdownMenuGroup>
//                 )}
//                 <DropdownMenuGroup>
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>

//                     <DropdownMenuItem asChild>
//                         <Link to="/profile">Profile</Link>
//                     </DropdownMenuItem>
//                     {user ? (
//                         <DropdownMenuGroup>
//                             <DropdownMenuItem asChild>
//                                 <Link
//                                     preload="render"
//                                     to="/profile"
//                                 >
//                                     My Bookings
//                                 </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                                 onClick={() => logout()}
//                                 className="cursor-pointer"
//                             >
//                                 Logout
//                             </DropdownMenuItem>
//                         </DropdownMenuGroup>
//                     ) : (
//                         <DropdownMenuItem
//                             asChild
//                             className="cursor-pointer"
//                         >
//                             <Link
//                                 preload="render"
//                                 to="/login"
//                             >
//                                 Login
//                             </Link>
//                         </DropdownMenuItem>
//                     )}
//                 </DropdownMenuGroup>

//                 <DropdownMenuSeparator />

//                 <DropdownMenuGroup>
//                     <DropdownMenuLabel>Theme</DropdownMenuLabel>

//                     <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>

//                     <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>

//                     <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//                 </DropdownMenuGroup>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }
