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

import { Circle } from "lucide-react";
import { useState, createContext, use } from "react";
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
import { useBookings } from "@/hooks/useBookings";

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
    const [blockDates, unblockDates, bookedDates, blockedDates] = useBookings(dateRange);

    const { idSelected, SetIdSelected } = useState(false);

    const blockedRanges = [];
    const bookedRanges = [];

    bookedDates.forEach(({ checkIn, checkOut, status }) => {
        const range = {
            from: new Date(checkIn),
            to: new Date(checkOut)
        };
        bookedRanges.push({ ...range });
    });

    blockedDates.forEach(({ id, checkIn, checkOut }) => {
        const range = {
            from: new Date(checkIn),
            to: new Date(checkOut)
        };
        blockedRanges.push({ ...range });
    });

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
                                                onClick={() => blockDates()}
                                            >
                                                Block Dates
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                className="text-green-400"
                                                onClick={() => {
                                                    unblockDates(
                                                        eachDayOfInterval({
                                                            start: dateRange.from,
                                                            end: dateRange.to
                                                        })
                                                    );
                                                }}
                                            >
                                                Unblock Dates
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
