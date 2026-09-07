import { BookingCalendar } from "@/components/BookingCalendar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function BookingPage() {
    const [selectedDates, setSelectedDates] = useState(null);

    return (
        <>
            <BookingCalendar onDateChange={setSelectedDates} />

            {selectedDates && <Button>Book</Button>}
        </>
    );
}
