import { BookingCalendar } from "@/components/BookingCalendar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { api } from "@/services/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function BookingPage() {
    const [selectedDates, setSelectedDates] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    async function book() {
        if (!selectedDates) return;

        const result = await api.post("/payment/create-checkout-session", {
            checkin: formatDateOnly(selectedDates.from),
            checkout: formatDateOnly(selectedDates.to),
            numberOfGuests: 1
        });

        console.log(result);

        setTimeout(() => {
            window.location.href = result.data.url;
        }, 1000);
    }

    function formatDateOnly(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return (
        <>
            <BookingCalendar
                onDateChange={e => {
                    setSelectedDates(e);
                    console.log(e);
                }}
            />

            {selectedDates && (
                <div>
                    <p>
                        We'll send your confirmation to: <strong>{user.email}</strong>
                    </p>
                    <Button onClick={book}>Book</Button>
                </div>
            )}
        </>
    );
}
