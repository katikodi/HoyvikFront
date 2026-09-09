import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "@/pages/ProfilePage.jsx";
import { currentUserQuery } from "@/queries/auth.queries";

export const Route = createFileRoute("/_index/profile")({
    beforeLoad: async ({ context }) => {
        const user = await context.queryClient.ensureQueryData(currentUserQuery);

        if (!user) {
            throw redirect({
                to: "/login"
            });
        }
    },
    component: ProfilePage
});
