import { useAuth } from "@/hooks/authContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/profile")({
    component: ProfileComponent,
    beforeLoad: ({ context }) => {
        if (!context.auth.user) {
            throw redirect({
                to: "/login"
            });
        }
    }
});

function ProfileComponent() {
    const { user } = useAuth();

    return <h1>hello {user.email}</h1>;
}
