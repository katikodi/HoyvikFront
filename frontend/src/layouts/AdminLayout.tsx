import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AdminSidebar";

export function AdminLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
