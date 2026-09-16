import ReactProfiler from "@/components/ReactProfiler";
import { Button } from "@/components/ui/button";
import { myBookingsQuery } from "@/queries/booking.queries";
import { useQuery } from "@tanstack/react-query";

export default function ProfileComponent() {
    const { data: bookings = [], isPending, isFetching, refetch } = useQuery(myBookingsQuery);

    if (isPending || isFetching) {
        return <h1>Loading bookings...</h1>;
    }

    return (
        <ReactProfiler id="ProfilePage">
            <div className="w-3/5 p-3 flex flex-col">
                <div className="flex flex-row justify-between">
                    <h2>Your bookings</h2>
                    <Button
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>
                {bookings.map(booking => (
                    <Booking
                        key={booking.id}
                        booking={booking}
                    />
                ))}

                <Button>Logout</Button>
            </div>
        </ReactProfiler>
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
