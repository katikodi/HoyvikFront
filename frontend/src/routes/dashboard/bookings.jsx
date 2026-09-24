import { createFileRoute } from "@tanstack/react-router";

import RouteComponent from "@/pages/DashBoardCalendar";

export const Route = createFileRoute("/dashboard/bookings")({
    component: RouteComponent
});
