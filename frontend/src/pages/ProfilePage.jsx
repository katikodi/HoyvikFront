import { useAuth } from "@/hooks/authContext";
import { api } from "@/services/client";
import { useEffect, useState } from "react";

export default function ProfileComponent() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const result = await api.get("/me/bookings");

                console.log(result.data);
                setBookings(result.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBookings();
    }, []);

    if (!user) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="h-dvh">
            {bookings.map(booking => (
                <Booking
                    key={booking.id}
                    booking={booking}
                />
            ))}
        </div>
    );
}

function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium"
    }).format(new Date(date));
}

function Booking({ booking }) {
    return (
        <div className="mx-auto  flex max-w-sm items-center gap-x-4 rounded-xl p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <p>Booking #{booking.id}</p>
            <p>Check-in: {formatDate(booking.checkIn)}</p>
            <p>Check-out: {formatDate(booking.checkOut)}</p>
        </div>
    );
}
