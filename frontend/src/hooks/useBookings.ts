import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getBlockedBookingsQuery, occupiedBookingsQuery, setBlockedBookings } from "@/queries/booking.queries";

type DateRange =
    | {
          from?: Date;
          to?: Date;
      }
    | undefined;

function formatDateOnly(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
const blockRange = async (dateRange: DateRange, reason?: string) => {
    console.assert(!dateRange, "there is no range to block");
    if (!dateRange) {
        return;
    }
    const { from, to } = dateRange;
    console.log(dateRange);
    if (!from || !to) {
        console.log("no daterange in block function");
        return;
    }
    console.log(`calling set blocked bookings with ${from} and ${to}`);
    await setBlockedBookings(formatDateOnly(from), formatDateOnly(to), reason);
};

const useBookings = (dateRange: DateRange) => {
    const queryClient = useQueryClient();
    let { data: bookedDates } = useQuery(occupiedBookingsQuery);
    let { data: blockedDates } = useQuery(getBlockedBookingsQuery);

    const mutation = useMutation({
        mutationFn: async () => {
            await blockRange(dateRange);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocked bookings"] });
        }
    });
    bookedDates = bookedDates || [];
    blockedDates = blockedDates || [];

    return [mutation, bookedDates, blockedDates];
};

export { useBookings };
