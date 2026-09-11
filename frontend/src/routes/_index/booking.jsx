import { BookingPage } from "@/pages/BookingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/booking")({
    component: BookingPage
});
