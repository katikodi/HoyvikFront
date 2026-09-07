import { Calendar } from "@/components/ui/calendar";
import { api } from "@/services/client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_index/booking")({
    component: BookingComponent
});

function BookingComponent() {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        getOccupiedDates();
        console.log(date);
    }, [date]);

    async function getOccupiedDates() {
        await api.get("/bookings/occupied");
        const result = await api("/bookings/occupied", {
            method: "GET"
        });
        const data = JSON.parse(result);
        console.log(data);
        const bookedDates = Array.from(data);
        console.log(bookedDates);
    }

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border"
        />
    );
}
