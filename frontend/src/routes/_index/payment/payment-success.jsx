import { Button } from "@/components/ui/button";
import { api } from "@/services/client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_index/payment/payment-success")({
    validateSearch: search => ({
        session_id: typeof search.session_id === "string" ? search.session_id : undefined
    }),

    component: PaymentSuccess
});

function PaymentSuccess() {
    const { session_id } = Route.useSearch();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!session_id) {
            setError("Missing payment session.");
            setLoading(false);
            return;
        }

        async function fetchBooking() {
            try {
                const response = await api.get(`/bookings/payment/${session_id}`);

                console.log(response.data);
                setBooking(response.data);
            } catch (err) {
                console.error(err);
                setError("Could not retrieve your booking.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [session_id]);

    if (loading) {
        return (
            <section>
                <h1>Confirming your booking...</h1>
                <p>Please wait while we confirm your payment.</p>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <h1>Something went wrong</h1>
                <p>{error}</p>
            </section>
        );
    }

    if (!booking) {
        return (
            <section>
                <h1>Booking not found</h1>
            </section>
        );
    }

    return (
        <section>
            <h1>Payment successful</h1>
            <p>Your booking is confirmed!</p>
            <div>
                <h2>Booking #{booking.id}</h2>
                <p>Check-in: {booking.checkIn}</p>
                <p>Check-out: {booking.checkOut}</p>
                <p>Guests: {booking.numberOfGuests}</p>
                <p>Total: {booking.price},-</p>
            </div>

            <Button>View my booking</Button>
        </section>
    );
}
