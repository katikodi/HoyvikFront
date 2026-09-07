import { Button } from "@/components/ui/button";
import { Dashboard } from "@/pages/AdminDashboard";
import { api } from "@/services/client";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: Dashboard
});
