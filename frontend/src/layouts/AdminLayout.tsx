import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export function AdminLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SidebarTrigger />
                    <Outlet />
                    <Toaster />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
