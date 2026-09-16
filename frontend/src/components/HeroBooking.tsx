import ReactProfiler from "@/components/ReactProfiler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";

import { DatePickerDemo } from "./DatePicker";
import { PeopleIcon } from "./ui/icons/people-icon";
import { CabinIcon } from "./ui/icons/cabin-icon";

import { occupiedBookingsQuery } from "@/queries/booking.queries";
import { useQuery } from "@tanstack/react-query";

const formSchema = z
    .object({
        checkIn: z.date(),
        checkOut: z.date(),
        guestAmount: z.number().min(1).max(4),
        cabin: z.string()
    })
    .refine(data => data.checkOut.getTime() >= data.checkIn.getTime(), {
        message: "End date must be on or after start date",
        path: ["checkOut"] // Highlights the error on the endDate field
    });

const HeroBooking = () => {
    // TODO: figure out how to handle stale cache
    const { data } = useQuery(occupiedBookingsQuery);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: new Date(),
            checkOut: new Date(),
            guestAmount: 1,
            cabin: ""
        },
        mode: "onChange"
    });
    // TODO: write this function
    function onSubmit(/*data: z.infer<typeof formSchema>*/) {
        console.log("TODO: do something cool here");
    }

    return (
        <ReactProfiler id="HeroBooking">
            <Card className="w-full h-fit rounded-none bg-[#B8CBBE]">
                <CardContent className="flex flex-row w-full justify-around">
                    <form
                        id="hero-booking-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full h-auto flex flex-row justify-around  "
                    >
                        <FieldGroup className="@container/field-group flex flex-row gap-2 h-auto items-end">
                            <Controller
                                control={form.control}
                                name="checkIn"
                                render={({ field, fieldState }) => (
                                    <Field orientation="vertical">
                                        <FieldLabel className="font-light">Innsjekk</FieldLabel>
                                        <div className="h-14">
                                            {/* TODO: maybe combine the two calendars to one with range selection */}
                                            <DatePickerDemo
                                                {...field}
                                                bookedDates={data}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="checkOut"
                                render={({ field, fieldState }) => (
                                    <Field orientation="vertical">
                                        <FieldLabel className="font-light">Utsjekk</FieldLabel>
                                        <div className="h-14">
                                            {/* TODO: maybe combine the two calendars to one with range selection */}
                                            <DatePickerDemo
                                                {...field}
                                                bookedDates={data}
                                            />
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="guestAmount"
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="vertical"
                                        className="w-fit"
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel
                                            className="font-light"
                                            htmlFor={field.name}
                                        >
                                            Innsjekk
                                        </FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={String(field.value)}
                                            onValueChange={e => {
                                                field.onChange(parseInt(e));
                                            }}
                                        >
                                            <SelectTrigger className="rounded-none border-2 border-solid border-[#2A3430]">
                                                <PeopleIcon className="size-8" />
                                                <SelectValue placeholder="Gjester" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none bg-[#B8CBBE] hover:bg-[#B8CBBE] active:bg-[#B8CBBE]">
                                                <SelectGroup className="bg-black">
                                                    {new Array(4).fill(0).map((_, i) => (
                                                        <SelectItem
                                                            value={String(i + 1)}
                                                            className="rounded-none bg-[#B8CBBE] focus:bg-[#B8CBBE]/80 "
                                                            key={i}
                                                        >
                                                            {i + 1}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="cabin"
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="vertical"
                                        className="w-fit"
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel
                                            className="font-light"
                                            htmlFor={field.name}
                                        >
                                            Hytte?
                                        </FieldLabel>

                                        <Select
                                            name={field.name}
                                            value={String(field.value)}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="rounded-none border-2 border-solid border-[#2A3430]">
                                                <CabinIcon className="size-8" />
                                                <SelectValue placeholder="Gjester" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none bg-[#B8CBBE] hover:bg-[#B8CBBE] active:bg-[#B8CBBE]">
                                                <SelectGroup className="bg-[#B8CBBE] hover:bg-[#B8CBBE]">
                                                    {["yes", "no", "maybe"].map((value, i) => (
                                                        <SelectItem
                                                            value={value}
                                                            className="rounded-none bg-[#B8CBBE] hover:bg-[#B8CBBE]"
                                                            key={i}
                                                        >
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Button
                                type="submit"
                                form="hero-booking-form"
                                className="rounded-none h-14 px-12 mt-auto bg-[#44383E] text-[#BCE8EF]"
                            >
                                Bestill
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </ReactProfiler>
    );
};

export { HeroBooking };
