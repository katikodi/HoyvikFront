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
const getOccupiedBookings = async () => {
    const { data } = await api.get("/bookings/occupied");
    return data;
};
export const myBookingsQuery = queryOptions({
    queryKey: ["bookings", "me"],
    queryFn: getMyBookings
});

export const occupiedBookingsQuery = queryOptions({
    queryKey: ["occupied bookings"],
    queryFn: getOccupiedBookings
});
