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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
    getBlockedBookingsQuery,
    occupiedBookingsQuery,
    setBlockedBookings,
    deleteBlockedBookigns
} from "@/queries/booking.queries";
import { Circle } from "lucide-react";
import { useState } from "react";
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
    const queryClient = useQueryClient();

    let { data: bookedDates, refetch: refetchOccupied } = useQuery(occupiedBookingsQuery);
    let { data: blockedDates, refetch: refetchBlocked } = useQuery(getBlockedBookingsQuery);

    const [reason, setReason] = useState("");
    bookedDates = bookedDates || [];

    const blockRange = async () => {
        const { from, to } = dateRange;
        if (!from || !to) {
            return;
        }

        await setBlockedBookings(formatDateOnly(from), formatDateOnly(to), reason);
    };

    const unblockRange = async () => {};

    const mutation = useMutation({
        mutationFn: blockRange,
        onSuccess: data => {
            queryClient.invalidateQueries(["blocked bookings"]);
        }
    });
    const [dateRange, setDateRange] = useState({
        from: undefined,
        to: undefined
    });

    const bookedRanges = bookedDates.map(formatDateResponse);

    blockedDates = blockedDates || [];
    const blockedRanges = blockedDates.map(({ id, checkIn, checkOut }) => {
        return {
            from: new Date(checkIn),
            to: new Date(checkOut),
            id
        };
    });

    const unblockDates = date => {};

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
                        blocked: blockedRanges
                    }}

                    components={{
                        DayButton: ({ children, modifiers, day, ...props }) => {
                            if (modifiers.today) {
                                console.log(modifiers);
                            }
                            if (modifiers.range_end || modifiers.range_middle || modifiers.range_start) {
                                return (
                                    <ContextMenu>
                                        <ContextMenuTrigger asChild>
                                            <CalendarDayButton
                                                day={day}
                                                modifiers={modifiers}
                                                {...props}
                                            >
                                                {children}
                                                <Circle
                                                    color={
                                                        modifiers.blocked ? "#0000ff" : modifiers.booked ? "#ff0000" : "#00ff00"
                                                    }
                                                />
                                            </CalendarDayButton>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                variant="destructive"
                                                onClick={() => mutation.mutate()}
                                            >
                                                Block Dates
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                );
                            }

                            return (
                                <CalendarDayButton
                                    day={day}
                                    modifiers={modifiers}
                                    {...props}
                                >
                                    {children}

                                    <Circle color={modifiers.blocked ? "#0000ff" : modifiers.booked ? "#ff0000" : "#00ff00"} />
                                </CalendarDayButton>
                            );
                        }
                    }}
                />
            </div>
        </div>
    );
}
