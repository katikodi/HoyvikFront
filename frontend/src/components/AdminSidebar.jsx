import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarMenuAction
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

export function AppSidebar() {
    const location = useLocation();
    console.log(location);
    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<SidebarMenuButton />}>
                                Select Workspace
                                <ChevronDown className="ml-auto" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupAction>
                            <Plus /> <span className="sr-only">Add Project</span>
                        </SidebarGroupAction>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Collapsible
                    defaultOpen
                    className="group/collapsible"
                >
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/">Home</Link>
                                </SidebarMenuButton>
                                <SidebarMenuAction>
                                    <Plus /> <span className="sr-only">Add Project</span>
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === "/dashboard" ? "true" : "false"}
                                >
                                    <Link to="/dashboard">Dashboard</Link>
                                </SidebarMenuButton>
                                <SidebarMenuAction>
                                    <Plus /> <span className="sr-only">Add Project</span>
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={location.pathname === "/dashboard/bookings" ? "true" : "false"}
                                >
                                    <Link to="/dashboard/bookings">Bookings</Link>
                                </SidebarMenuButton>
                                <SidebarMenuAction>
                                    <Plus /> <span className="sr-only">Add Project</span>
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>Username</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
