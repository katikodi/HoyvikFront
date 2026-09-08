import { Button } from "@/components/ui/button";
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
        <div className="w-3/5 p-3 flex flex-col">
            <h2>Your bookings</h2>
            {bookings.map(booking => (
                <Booking
                    key={booking.id}
                    booking={booking}
                />
            ))}

            <Button>Logout</Button>
        </div>
    );
}

function Booking({ booking }) {
    return (
        <div className="h-fit border rounded p-2 m-2 hover:bg-gray-800">
            <p>Booking #{booking.id}</p>
            <p>Check-in: {formatDate(booking.checkIn)}</p>
            <p>Check-out: {formatDate(booking.checkOut)}</p>
            <div className="flex justify-between">
                <Button>View Details</Button>
                <Button>Cancel</Button>
            </div>
        </div>
    );
}

function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium"
    }).format(new Date(date));
}
