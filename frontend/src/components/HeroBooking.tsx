"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";

import { DatePickerDemo } from "./DatePicker";
import { PeopleIcon } from "./ui/icons/people-icon";
import { CabinIcon } from "./ui/icons/cabin-icon";

const formSchema = z.object({
    checkIn: z.iso.date(),
    checkOut: z.iso.date(),
    guestAmount: z.number().min(1).max(4),
    cabin: z.string()
});

const HeroBooking = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: "",
            checkOut: "",
            guestAmount: 1,
            cabin: ""
        },
        mode: "onChange"
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2"
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)"
            } as React.CSSProperties
        });
    }

    return (
        <Card className="w-full h-fit rounded-none bg-[#B8CBBE]">
            <CardContent className="flex flex-row w-full">
                <form
                    id="hero-booking-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                >
                    <FieldGroup className="@container/field-group flex flex-row gap-6 h-auto">
                        <Controller
                            control={form.control}
                            name="checkIn"
                            render={({ field }) => (
                                <Field
                                    orientation="vertical"
                                    className="grow-7"
                                >
                                    <FieldLabel className="font-light">Innsjekk</FieldLabel>
                                    <div className="h-12">
                                        <DatePickerDemo {...field} />
                                    </div>
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="checkOut"
                            render={({ field }) => (
                                <Field
                                    orientation="vertical"
                                    className="grow-7"
                                >
                                    <FieldLabel className="font-light">Utsjekk</FieldLabel>
                                    <div className="h-12">
                                        <DatePickerDemo {...field} />
                                    </div>
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
                                        <SelectTrigger className="w-[180px] grow rounded-none border-2 border-solid border-[#2A3430]">
                                            <PeopleIcon className="size-8" />
                                            <SelectValue placeholder="Gjester" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none bg-[#B8CBBE] hover:bg-[#B8CBBE] active:bg-[#B8CBBE]">
                                            <SelectGroup className="bg-[#B8CBBE] hover:bg-[#B8CBBE]">
                                                {new Array(4).fill(0).map((_, i) => (
                                                    <SelectItem
                                                        value={String(i + 1)}
                                                        className="rounded-none bg-[#B8CBBE] hover:bg-[#B8CBBE]"
                                                        key={i}
                                                    >
                                                        {i + 1}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {/* <Input
                                        {...field}
                                        className="grow rounded-none border-2 border-solid border-[#2A3430]"
                                    /> */}
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                        <SelectTrigger className="w-[180px] grow rounded-none border-2 border-solid border-[#2A3430]">
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
                                    {/* <Input
                                        {...field}
                                        className="grow rounded-none border-2 border-solid border-[#2A3430]"
                                    /> */}
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Field orientation="vertical">
                            <Button
                                type="submit"
                                form="hero-booking-form"
                                className=" rounded-none h-12 mt-auto bg-[#44383E] text-[#BCE8EF]"
                            >
                                Bestill
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export { HeroBooking };
