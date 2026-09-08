import { Dashboard } from "@/pages/AdminDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: Dashboard
});
