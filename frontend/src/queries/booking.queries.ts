import { api } from "@/services/client";
import { queryOptions } from "@tanstack/react-query";

export type Booking = {
    id: number;
    checkIn: string;
    checkOut: string;
};

async function getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>("/me/bookings");
    return data;
}

export const myBookingsQuery = queryOptions({
    queryKey: ["bookings", "me"],
    queryFn: getMyBookings
});
