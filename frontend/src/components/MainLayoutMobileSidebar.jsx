import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

import { ChevronRight, Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

import { Link } from "@tanstack/react-router";
import { useTheme } from "./theme-provider";

// {user?.roles.includes("admin") && (
//           <DropdownMenuGroup>
//             <DropdownMenuLabel>Admin</DropdownMenuLabel>
//             <DropdownMenuItem asChild>
//               <Link to="/admin">Admin Page</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <Link to="/dashboard">Dashboard</Link>
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         )}

{
    /* <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuItem asChild>
           
          </DropdownMenuItem>
          {user ? (
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
               
              </DropdownMenuItem>
              
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuItem asChild className="cursor-pointer">
             
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>

         
        </DropdownMenuGroup>
      </DropdownMenuContent> */
}

const themes = ["light", "dark", "system"];

const MainLayoutMobileSidebar = ({ children, navLinks, myAccount }) => {
    const { setTheme } = useTheme();
    return (
        <SidebarProvider>
            <main className="w-dvw max-w-dvw overflow-x-clip">
                <SideBarTrigger />
                {children}
            </main>
            <Sidebar
                side="right"
                variant="floating"
            >
                <SidebarHeader>
                    <div className="bg-red-500 text-5xl font-extrabold">LOGO</div>
                </SidebarHeader>
                <SidebarContent>
                    <Collapsible
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="font-sans text-lg">
                                    Sider
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>{navLinks}</SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                    <Collapsible
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="font-sans text-lg">
                                    My account
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>

                            <CollapsibleContent>
                                <SidebarGroupContent>{myAccount}</SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                    <Collapsible
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger className="font-sans text-lg">
                                    Teme
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {themes.map(theme => (
                                            <SidebarMenuItem key={theme}>
                                                <SidebarMenuButton
                                                    onClick={() => setTheme(theme)}
                                                    className="font-sans text-[#B8CBBE] h-9 content-center cursor-pointer"
                                                >
                                                    {theme}
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>

            {/* <AppSidebar /> */}
        </SidebarProvider>
    );
};

const SideBarTrigger = () => {
    const { toggleSidebar } = useSidebar();
    return (
        <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-4 z-50 rounded-none"
            onClick={toggleSidebar}
        >
            <Menu />
            <span className="sr-only">Open menu</span>
        </Button>
    );
};

export { MainLayoutMobileSidebar };
