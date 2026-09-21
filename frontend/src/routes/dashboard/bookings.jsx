import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";

import { Circle, CalendarCheck, CalendarX, CalendarClock, Book } from "lucide-react";
import { useState, createContext, use, useMemo } from "react";
import {
    Command,
    CommandInput,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from "@/components/ui/command";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { eachDayOfInterval, setDate } from "date-fns";
import {
    occupiedBookingsQuery,
    getBlockedBookingsQuery,
    setBlockedBookings,
    deleteBlockedBookigns
} from "@/queries/booking.queries";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
const formatStatus = status => (status === 1 ? "Confirmed" : "Pending");
export const Route = createFileRoute("/dashboard/bookings")({
    component: RouteComponent
});

function formatDateOnly(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const formatDateResponse = ({ checkIn, checkOut, reason }) => {
    return {
        from: new Date(checkIn),
        to: new Date(checkOut),
        reason: reason
    };
};

function RouteComponent() {
    const [dateRange, setDateRange] = useState();
    const queryClient = useQueryClient();
    let { data: bookedDates } = useQuery(occupiedBookingsQuery);
    let { data: blockedDates } = useQuery(getBlockedBookingsQuery);
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
    const getRange = (modifiers, day) => {
        if (modifiers.range_end || modifiers.range_middle || modifiers.range_start) {
            return eachDayOfInterval({
                start: dateRange.from,
                end: dateRange.to
            }).map(date => formatDateOnly(date));
        }
        return [formatDateOnly(day.date)];
    };

    const unBlockDates = useMutation({
        mutationFn: deleteBlockedBookigns,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blocked bookings", "occupied bookings"]
            });
        }
    });
    const confirmedBookings = useMemo(() => {
        return bookedDates
            .filter(({ status }) => formatStatus(status) === "Confirmed")
            .map(({ checkIn, checkOut }) => {
                return {
                    from: new Date(checkIn),
                    to: new Date(checkOut)
                };
            });
    }, [bookedDates]);

    const pendingBookings = useMemo(() => {
        return bookedDates
            .filter(({ status }) => formatStatus(status) === "Pending")
            .map(({ checkIn, checkOut }) => {
                return {
                    from: new Date(checkIn),
                    to: new Date(checkOut)
                };
            });
    }, [bookedDates]);

    const bookedRanges = useMemo(() => {
        return bookedDates.map(({ checkIn, checkOut }) => {
            return {
                from: new Date(checkIn),
                to: new Date(checkOut)
            };
        });
    }, [bookedDates]);

    const formatedBlockedDates = useMemo(() => {
        return blockedDates.map(date => {
            return new Date(date.date);
        });
    }, [blockedDates]);

    return (
        <div>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    className="h-full w-auto bg-gray-800 text-gray-300"
                    captionLayout="dropdown"
                    formatters={{
                        formatMonthDropdown: date => {
                            return date.toLocaleString("default", { month: "long" });
                        }
                    }}
                    modifiers={{
                        booked: bookedRanges,
                        blocked: formatedBlockedDates,
                        confirmedBookings: confirmedBookings,
                        pendingBookings: pendingBookings
                    }}

                    components={{
                        DayButton: ({ children, modifiers, day, ...props }) => {
                            // return (
                            //   <DayButton
                            //     children={children}
                            //     modifiers={modifiers}
                            //     day={day}
                            //     dateRange={dateRange}
                            //     {...props}
                            //   />
                            // );
                            return (
                                <ContextMenu>
                                    <ContextMenuTrigger asChild>
                                        <DayButton
                                            children={children}
                                            modifiers={modifiers}
                                            day={day}
                                            dateRange={dateRange}
                                            {...props}
                                        />
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem
                                            variant="destructive"
                                            onClick={() => blockDates.mutate(getRange(modifiers, day))}
                                        >
                                            Block Dates
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            className="text-green-400"
                                            onClick={() => unBlockDates.mutate(getRange(modifiers, day))}
                                        >
                                            Unblock Dates
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            );
                        }
                    }}
                />
            </div>
        </div>
    );
}

const DayButton = ({ modifiers, children, day, dateRange, status, ...props }) => {
    return (
        <CalendarDayButton
            day={day}
            modifiers={modifiers}
            {...props}
        >
            {children}
            <DayButtonIcon modifiers={modifiers} />
        </CalendarDayButton>
    );
};

const DayButtonIcon = ({ modifiers }) => {
    if (modifiers.blocked) {
        return <CalendarX className="stroke-red-500" />;
    }
    if (modifiers.confirmedBookings) {
        return <CalendarCheck className="stroke-green-500" />;
    }
    if (modifiers.pendingBookings) {
        return <CalendarClock className="stroke-yellow-500" />;
    }
};

const BookingContext = () => {};
