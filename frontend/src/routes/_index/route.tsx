import MainLayout from "@/layouts/MainLayout.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index")({
    component: MainLayout
});
