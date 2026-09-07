import RegisterPage from "@/pages/RegisterPage.jsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
    beforeLoad: ({ context }) => {
        if (context.auth.user) {
            throw redirect({
                to: "/"
            });
        }
    },
    component: RegisterPage
});
