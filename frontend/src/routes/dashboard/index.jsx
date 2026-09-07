import { Button } from "@/components/ui/button";
import { api } from "@/services/client";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: Dashboard
});

function Dashboard() {
    const navigate = useNavigate();

    async function resetDatabase() {
        const result = await api("/admin/database/reset", {
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
