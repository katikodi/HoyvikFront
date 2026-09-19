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
export default function RootLayout() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            {/* <HamburgerDropdown /> */}
        </>
    );
}
