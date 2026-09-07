import { AdminLayout } from "@/layouts/AdminLayout";
import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: ({ context }) => {
        if (!context.auth.user) {
            throw redirect({
                to: "/login"
            });
        }

        if (!context.auth.isAdmin) {
            throw redirect({ to: "/" });
        }
    },
    component: AdminLayout
});
