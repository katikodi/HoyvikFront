import { Button } from "@/components/ui/button";
import { api } from "@/services/client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <div className="flex flex-1 items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Payment successful</CardTitle>
                    <CardDescription>Your booking has been confirmed.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <p>
                        Your booking confirmation will be sent to <strong>{booking.email}</strong>.
                    </p>

                    <div className="space-y-2">
                        <h2 className="font-semibold">Booking #{booking.id}</h2>

                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Check-in: {booking.checkIn}</p>
                            <p>Check-out: {booking.checkOut}</p>
                            <p>Guests: {booking.numberOfGuests}</p>
                            <p>Total: {booking.price},-</p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="w-full">View my booking</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
