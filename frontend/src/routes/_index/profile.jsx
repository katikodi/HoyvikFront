import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "@/pages/ProfilePage.jsx";

export const Route = createFileRoute("/_index/profile")({
    component: ProfilePage,
    beforeLoad: ({ context }) => {
        if (!context.auth.user) {
            throw redirect({
                to: "/login"
            });
        }
    }
});
