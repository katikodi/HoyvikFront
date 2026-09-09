import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminDashboard from "@/pages/AdminDashboard.jsx";

export const Route = createFileRoute("/dashboard/")({
    beforeLoad: ({ context }) => {
        if (!context.auth.user) {
            console.log(context.auth.user);
            throw redirect({
                to: "/login"
            });
        }

        if (!context.auth.isAdmin) {
            console.log("not admin");
            throw redirect("/");
        }
    },

    component: AdminDashboard
});
