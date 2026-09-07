import { Calendar } from "@/components/ui/calendar";
import { api } from "@/services/client";
import { useEffect, useState } from "react";

export function BookingPage() {
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
        console.log(result);

        const bookedDates = Array.from(data);
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
