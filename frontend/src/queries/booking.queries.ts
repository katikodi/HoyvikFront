import { api } from "@/services/client";
import type { Booking } from "@/types/booking";
import { queryOptions } from "@tanstack/react-query";

async function getMyBookings(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>("/me/bookings");
  return data;
}
const getOccupiedBookings = async () => {
  const { data } = await api.get("/bookings/occupied");
  return data;
};

const getBlockedBookings = async () => {
  const { data } = await api.get("/admin/blocked-dates");
  return data;
};

const setBlockedBookings = async (blockedDates: string[]) => {
  console.log(blockedDates);
  const res = await api.post("/admin/blocked-dates", {
    blockedDates: blockedDates,
  });
  return res;
};

const deleteBlockedBookigns = async (dates: string[]) => {
  const res = await fetch("/api/admin/blocked-dates", {
    method: "DELETE",
    body: JSON.stringify({
      blockedDates: dates,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  //       api.delete(`/admin/blocked-periods`, {
  //     blockedDates: dates,
  //   });
  return res;
};
export const myBookingsQuery = queryOptions({
  queryKey: ["bookings", "me"],
  queryFn: getMyBookings,
});

export const occupiedBookingsQuery = queryOptions({
  queryKey: ["occupied bookings", "blocked bookings"],
  queryFn: getOccupiedBookings,
});

export const getBlockedBookingsQuery = queryOptions({
  queryKey: ["blocked bookings", "occupied bookings"],
  queryFn: getBlockedBookings,
});

export { setBlockedBookings, deleteBlockedBookigns };
