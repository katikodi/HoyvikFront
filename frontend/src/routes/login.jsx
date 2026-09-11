import LoginPage from "@/pages/LoginPage.jsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    beforeLoad: ({ context }) => {
        if (context.auth.user) {
            throw redirect({
                to: "/"
            });
        }
    },
    component: LoginPage
});
