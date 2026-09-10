import { Button } from "@/components/ui/button";
import { myBookingsQuery } from "@/queries/booking.queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/bookings/")({
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(myBookingsQuery);
    },
    component: Bookings
});

function Bookings() {
    const { data: bookings = [], isPending, isError, isFetched, refetch } = useQuery(myBookingsQuery);

    return (
        <div>
            <h2>Bookings</h2>
            {bookings.map(b => (
                <Booking
                    key={b.id}
                    booking={b}
                />
            ))}
        </div>
    );
}

function Booking({ booking }) {
    function formatDate(date) {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium"
        }).format(new Date(date));
    }

    return (
        <section className="h-fit border rounded p-2 m-2 hover:bg-gray-800">
            <p>Booking #{booking.id}</p>
            <p>Check-in: {formatDate(booking.checkIn)}</p>
            <p>Check-out: {formatDate(booking.checkOut)}</p>
            <div className="flex justify-between">
                <Button>View Details</Button>
                <Button>Cancel</Button>
            </div>
        </section>
    );
}
