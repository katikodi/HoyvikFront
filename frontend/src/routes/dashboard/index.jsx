import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/client";
import { createFileRoute, redirect } from "@tanstack/react-router";

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

    component: Dashboard
});

function Dashboard() {
    async function resetDatabase() {
        await apiFetch("/api/admin/database/reset", {
            method: "post"
        });
    }
    return (
        <div className="p-2">
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard.</p>
            <Button onClick={resetDatabase}>Reset database</Button>
        </div>
    );
}
