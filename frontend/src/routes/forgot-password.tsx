import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password")({
    component: RouteComponent
});

function RouteComponent() {
    return <div></div>;
}
