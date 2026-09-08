import { Calendar } from "@/components/ui/calendar";
import { api } from "@/services/client";
import { useEffect, useState } from "react";

export function BookingCalendar({ onDateChange }) {
    const [occupiedPeriods, setOccupiedPeriods] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: undefined,
        to: undefined
    });

    useEffect(() => {
        async function getOccupiedDates() {
            const { data } = await api("/bookings/occupied", {
                method: "GET"
            });

            setOccupiedPeriods(data);
        }
        getOccupiedDates();
    }, []);

    function startOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function getMaxBookingDate() {
        const date = new Date();

        date.setMonth(date.getMonth() + 6);

        return startOfDay(date);
    }

    function isOccupied(date) {
        const current = startOfDay(date);

        return occupiedPeriods.some(period => {
            const checkIn = startOfDay(new Date(period.checkIn));
            const checkOut = startOfDay(new Date(period.checkOut));

            return current >= checkIn && current < checkOut;
        });
    }

    function isDisabled(date) {
        const current = startOfDay(date);
        const today = startOfDay(new Date());
        const maxDate = getMaxBookingDate();

        // Past
        if (current < today) {
            return true;
        }

        // Too far in the future
        if (current > maxDate) {
            return true;
        }

        // Already occupied
        if (isOccupied(current)) {
            return true;
        }

        return false;
    }

    function handleSelect(range) {
        setDateRange(range);

        if (!range?.from || !range?.to) {
            onDateChange?.(null);
            return;
        }

        const from = startOfDay(range.from);
        const to = startOfDay(range.to);

        const overlaps = occupiedPeriods.some(period => {
            const checkIn = startOfDay(new Date(period.checkIn));
            const checkOut = startOfDay(new Date(period.checkOut));

            return from < checkOut && to > checkIn;
        });

        if (overlaps) {
            setDateRange({
                from: undefined,
                to: undefined
            });

            onDateChange?.(null);
            return;
        }

        const newRange = {
            from,
            to
        };

        setDateRange(newRange);
        onDateChange?.(newRange);
    }

    return (
        <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            disabled={isDisabled}
            fromDate={startOfDay(new Date())}
            toDate={getMaxBookingDate()}
            className="rounded-lg border"
        />
    );
}
