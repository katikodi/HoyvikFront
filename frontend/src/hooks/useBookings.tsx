import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createContext } from "react";

export const BookingContext = createContext({});

import {
    getBlockedBookingsQuery,
    occupiedBookingsQuery,
    setBlockedBookings,
    deleteBlockedBookigns
} from "@/queries/booking.queries";
// type Booking = {
//   checkIn: string;
//   checkOut: string;
//   status: number;
// };

const useBookings = () => {
    const queryClient = useQueryClient();
    let { data: bookedDates } = useQuery(occupiedBookingsQuery);
    let { data: blockedDates } = useQuery(getBlockedBookingsQuery);
    console.log("was here");
    bookedDates = bookedDates || [];
    blockedDates = blockedDates || [];
    const blockDates = useMutation({
        mutationFn: setBlockedBookings,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blocked bookings", "occupied bookings"]
            });
        }
    });

    const unBlockDates = useMutation({
        mutationFn: deleteBlockedBookigns,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blocked bookings", "occupied bookings"]
            });
        }
    });
    // const confirmedBookings = bookedDates
    //   .filter(({ status }: Booking) => formatStatus(status) === "Confirmed")
    //   .map(({ checkIn, checkOut }: Booking) => {
    //     return {
    //       from: new Date(checkIn),
    //       to: new Date(checkOut),
    //     };
    //   });
    // const pendingBookings = bookedDates
    //   .filter(({ status }: Booking) => formatStatus(status) === "Pending")
    //   .map(({ checkIn, checkOut }: Booking) => {
    //     return {
    //       from: new Date(checkIn),
    //       to: new Date(checkOut),
    //     };
    //   });

    return {
        blockDays: blockDates.mutate,
        unblockDays: unBlockDates.mutate,
        bookedDates: bookedDates,
        blockedDates: blockedDates
        // confirmedBookings,
        // pendingBookings,
    };
};

export { useBookings };
