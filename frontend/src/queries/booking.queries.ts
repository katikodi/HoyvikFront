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

const getBlockedBookings = async () => {
    const { data } = await api.get("/admin/blocked-periods");
    return data;
};

const setBlockedBookings = async (checkIn: string, checkOut: string, reason?: string) => {
    const res = await api.post("/admin/blocked-periods", {
        blockedPeriods: [
            {
                checkIn,
                checkOut,
                reason
            }
        ]
    });
    return res;
};

const deleteBlockedBookigns = async (id: number) => {
    const res = await api.delete(`/admin/blocked-periods?id=${id}}`);
    return res;
};
export const myBookingsQuery = queryOptions({
    queryKey: ["bookings", "me"],
    queryFn: getMyBookings
});

export const occupiedBookingsQuery = queryOptions({
    queryKey: ["occupied bookings"],
    queryFn: getOccupiedBookings
});

export const getBlockedBookingsQuery = queryOptions({
    queryKey: ["blocked bookings"],
    queryFn: getBlockedBookings
});

export { setBlockedBookings, deleteBlockedBookigns };
