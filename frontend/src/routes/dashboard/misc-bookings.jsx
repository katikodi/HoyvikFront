import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/misc-bookings")({
    component: RouteComponent
});

function RouteComponent() {
    return <div>Hello "/dashboard/misc-bookings"!</div>;
}
