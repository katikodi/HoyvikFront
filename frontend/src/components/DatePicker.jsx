"use client";

import * as React from "react";
import { cn } from "cn";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "./ui/icons/calendar-icon";

export function DatePickerDemo({ value, onChange, ...props }) {
    return (
        <Popover {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground rounded-none h-full w-full bg-transparent border-2 border-solid border-[#2A3430]"
                >
                    <CalendarIcon className="size-8" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                />
            </PopoverContent>
        </Popover>
    );
}
