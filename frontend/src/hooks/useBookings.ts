import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    getBlockedBookingsQuery,
    occupiedBookingsQuery,
    setBlockedBookings,
    deleteBlockedBookigns
} from "@/queries/booking.queries";

function formatDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
const useBookings = () => {
    const queryClient = useQueryClient();
    let { data: bookedDates } = useQuery(occupiedBookingsQuery);
    let { data: blockedDates } = useQuery(getBlockedBookingsQuery);

    bookedDates = bookedDates || [];
    blockedDates = blockedDates || [];
    const blockDates = useMutation({
        mutationFn: setBlockedBookings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocked bookings"] });
        }
    });
    const unBlockDates = useMutation({
        mutationFn: deleteBlockedBookigns,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocked bookings"] });
        }
    });
    bookedDates = bookedDates || [];
    blockedDates = blockedDates || [];

    return [blockDates.mutate, unBlockDates.mutate, bookedDates, blockedDates];
};

export { useBookings };
