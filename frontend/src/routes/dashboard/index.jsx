import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    beforeLoad: ({ context }) => {
        if (!context.auth.user) {
            throw redirect({
                to: "/login"
            });
        }

        if (!context.auth.isAdmin) {
            throw redirect("/");
        }
    },

    component: Dashboard
});

function Dashboard() {
    return (
        <div className="p-2">
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard.</p>
        </div>
    );
}
