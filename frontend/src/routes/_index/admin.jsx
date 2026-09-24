import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/AdminDashboard";

export const Route = createFileRoute("/_index/admin")({
    component: Dashboard
});
