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

import { AlignHorizontalDistributeCenterIcon, Circle } from "lucide-react";
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
import { useDayPicker, DayPicker, DayButton } from "react-day-picker";
import { useBookings } from "@/hooks/useBookings";

// Create a context to share the selected date state between the custom DayButton and the main component.
const SelectedDateContext = createContext({});

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
    const [mutation, bookedDates, blockedDates] = useBookings(dateRange);

    console.log(mutation);

    // mutation && console.log(`mutation ${typeof mutation}`);

    const { idSelected, SetIdSelected } = useState(false);

    const setRange = daterange => {
        if (idSelected) {
            return;
        }

        setDateRange();
    };

    // const onSelect = (day, modifiers) => {
    //   if (modifiers.disabled || modifiers.hidden) return;
    //   if (modifiers.selected) {
    //     setDateRange(undefined);
    //     return;
    //   }
    //   setDateRange(
    //     modifiers.booked
    //       ? bookedDates[bookedDateRangeIds[day.date]]
    //       : modifiers.blocked
    //         ? blockedRanges[blockedDateRangeIds[day.date]]
    //         : undefined,
    //   );
    // };

    const blockedDateRangeIds = {};
    const bookedDateRangeIds = {};
    const blockedRanges = {};
    const bookedRanges = [];
    console.log("bookedates");
    console.log(bookedDates);
    console.log("bookedRanGES");

    console.log(bookedRanges);

    bookedDates.forEach(({ checkIn, checkOut, status }) => {
        const range = {
            from: new Date(checkIn),
            to: new Date(checkOut)
        };
        bookedRanges.push({ ...range });
    });

    blockedDates.forEach(({ id, checkIn, checkOut }) => {
        console.assert(blockedDates[id] === undefined);
        const range = {
            from: new Date(checkIn),
            to: new Date(checkOut)
        };
        blockedRanges[id] = { ...range };
        const eachDay = eachDayOfInterval({
            start: range.from,
            end: range.to
        }).forEach(day => {
            console.assert(blockedDateRangeIds[day] === undefined);
            blockedDateRangeIds[day] = id;
        });
    });
    console.log(bookedRanges);
    console.log(blockedRanges);

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
                {
                    //<DefaultCalendar
                    // dateRange={dateRange}
                    // setDateRange={setDateRange}
                    // bookedRanges={bookedRanges}
                    // blockedRanges={blockedRanges}
                    // /> */
                }
                <TempCal
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    bookedRanges={bookedRanges}
                    blockedRanges={Object(blockedRanges).values}
                    block={() => {
                        console.log("mutation");
                        mutation.mutate();
                    }}
                />
            </div>
        </div>
    );
}

const TempCal = ({ dateRange, setDateRange, bookedRanges, blockedRanges, block }) => {
    if (!block) {
        console.log(setDateRange);
        return <div>no blocking function</div>;
    }

    return (
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
            onDayClick={(day, modifiers) => {
                console.log("day clkci ");
                if (modifiers.disabled || modifiers.hidden) return;
                if (modifiers.selected) {
                    setDateRange(undefined);
                    return;
                }
                if (modifiers.booked) {
                    setDateRange(bookedDates[bookedDateRangeIds[day.date]]);
                }
                if (modifiers.blocked) {
                    setDateRange(blockedDates[blockedDateRangeIds[day.date]]);
                }
            }}

            components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                    const context = useDayPicker();

                    const id = modifiers.blocked ? blockedDateRangeIds[day.date] : 0;
                    if (modifiers.today) {
                        // console.log(modifiers);
                        // console.log(context);
                        // console.log(`daterange: ${JSON.stringify(dateRange)}`);
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
                                            color={modifiers.blocked ? "#0000ff" : modifiers.booked ? "#ff0000" : "#00ff00"}
                                        />
                                    </CalendarDayButton>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem
                                        variant="destructive"
                                        onClick={() => {
                                            console.log("click");
                                            block();
                                        }}
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
    );
};

const DefaultCalendar = (
    {
        // dateRange,
        // setDateRange,
        // bookedRanges,
        // blockedRanges,
    }
) => {
    <Calendar
        mode="range"
        // selected={dateRange}
        className="h-full w-auto bg-gray-800 text-gray-300"
        captionLayout="dropdown"
        formatters={{
            formatMonthDropdown: date => {
                return date.toLocaleString("default", { month: "long" });
            }
        }}
        // modifiers={{
        //   booked: bookedRanges,
        //   blocked: blockedRanges,
        // }}
        // onDayClick={(day, modifiers) => {
        //   if (modifiers.disabled || modifiers.hidden) return;
        //   if (modifiers.selected) {
        //     setDateRange(undefined);
        //     return;
        //   }
        //   if (modifiers.booked) {
        //     setDateRange(bookedDates[bookedDateRangeIds[day.date]]);
        //   }
        //   if (modifiers.blocked) {
        //     setDateRange(blockedDates[blockedDateRangeIds[day.date]]);
        //   }
        // }}

        // components={{
        //   DayButton: ({ children, modifiers, day, ...props }) => {
        //     // const context = useDayPicker();

        //     const id = modifiers.blocked
        //       ? blockedDateRangeIds[day.date]
        //       : modifiers.booked
        //         ? bookedDateRangeIds[day.date]
        //         : 0;
        //     if (modifiers.today) {
        //       console.log(modifiers);
        //       // console.log(context);
        //     }
        //     if (
        //       modifiers.range_end ||
        //       modifiers.range_middle ||
        //       modifiers.range_start
        //     ) {
        //       return (
        //         <ContextMenu>
        //           <ContextMenuTrigger asChild>
        //             <CalendarDayButton day={day} modifiers={modifiers} {...props}>
        //               {children}
        //               <Circle
        //                 color={
        //                   modifiers.blocked
        //                     ? "#0000ff"
        //                     : modifiers.booked
        //                       ? "#ff0000"
        //                       : "#00ff00"
        //                 }
        //               />
        //             </CalendarDayButton>
        //           </ContextMenuTrigger>
        //           <ContextMenuContent>
        //             <ContextMenuItem
        //               variant="destructive"
        //               onClick={() => {
        //                 console.log("block");
        //                 mutation.mutate();
        //               }}
        //             >
        //               Block Dates
        //             </ContextMenuItem>
        //           </ContextMenuContent>
        //         </ContextMenu>
        //       );
        //     }

        //     return (
        //       <CalendarDayButton day={day} modifiers={modifiers} {...props}>
        //         {children}
        //         <p>{`id: ${id}`}</p>

        //         <Circle
        //           color={
        //             modifiers.blocked
        //               ? "#0000ff"
        //               : modifiers.booked
        //                 ? "#ff0000"
        //                 : "#00ff00"
        //           }
        //         />
        //       </CalendarDayButton>
        //     );
        //   },
        // }}
    />;
};

function DayButtonWithContext(props) {
    const { day, modifiers, ...buttonProps } = props;

    const { setSelected } = use(SelectedDateContext);
    return (
        <DayButton
            {...buttonProps}
            day={day}
            modifiers={modifiers}
            onClick={() => setSelected?.(undefined)}
            onDoubleClick={() => setSelected?.(day.date)}
        />
    );
}

export function MyDatePicker() {
    const [selected, setSelected] = useState();

    return (
        <SelectedDateContext.Provider value={{ selected, setSelected }}>
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                components={{
                    DayButton: DayButtonWithContext
                }}
            />
        </SelectedDateContext.Provider>
    );
}
