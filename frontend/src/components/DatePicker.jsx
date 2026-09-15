"use client";

import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "./ui/icons/calendar-icon";

export function DatePickerDemo({ value, onChange, bookedDates, ...props }) {
    bookedDates = bookedDates || [];
    const bookedRanges = bookedDates.map(({ checkIn, checkOut }) => {
        return {
            from: new Date(checkIn),
            to: new Date(checkOut)
        };
    });
    return (
        <Popover {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground data-[empty=false]:bg-muted rounded-none h-full w-full bg-transparent border-2 border-solid border-[#2A3430]"
                >
                    <CalendarIcon className="size-8" />
                    {value ? format(value, "P") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={[...bookedRanges, { before: new Date() }]}
                    modifiers={{
                        booked: bookedRanges
                    }}
                    modifiersClassNames={{
                        booked: "[&>button]:line-through opacity-100 text-red-500"
                    }}
                    fixedWeeks
                />
            </PopoverContent>
        </Popover>
    );
}
