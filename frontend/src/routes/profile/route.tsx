import ProfileLayout from "@/layouts/ProfileLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
    component: ProfileLayout
});
