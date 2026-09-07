import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/client";

export default function AdminDashboard() {
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
