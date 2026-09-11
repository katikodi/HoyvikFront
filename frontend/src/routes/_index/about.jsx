import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/pages/AboutPage.jsx";

export const Route = createFileRoute("/_index/about")({
    component: AboutPage
});
