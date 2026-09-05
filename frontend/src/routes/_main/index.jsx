import { useAuth } from "@/hooks/authContext";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
    component: MainLayout
});

function MainLayout() {
    const { user } = useAuth();

    if (user) {
        return <h1>Hello {user.fullName}</h1>;
    }

    return <></>;
}
