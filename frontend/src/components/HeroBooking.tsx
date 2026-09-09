"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { DatePickerDemo } from "./DatePicker";

const formSchema = z.object({
    checkIn: z.iso.date(),
    checkOut: z.iso.date(),
    guestAmount: z.number().min(1).max(20)
});

const HeroBooking = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: "",
            checkOut: "",
            guestAmount: 1
        }
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
        <Card className="w-full h-fit rounded-none">
            <CardContent className="flex flex-row w-full h-fit">
                <form
                    id="hero-booking-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="h-fit w-full"
                >
                    <FieldGroup className="@container/field-group flex flex-row gap-6 grow h-fit">
                        <Controller
                            name="checkIn"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    data-invalid={fieldState.invalid}
                                    orientation="vertical"
                                    className="h-fit"
                                >
                                    <FieldLabel>Innsjekk</FieldLabel>
                                    <DatePickerDemo {...field} />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="checkOut"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Utsjekk</FieldLabel>
                                    <DatePickerDemo {...field} />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="guestAmount"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="gjester">Gjester</FieldLabel>
                                    <Input
                                        {...field}
                                        id="gjester"
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            )}
                        />
                        <Button
                            type="submit"
                            form="hero-booking-form"
                        >
                            Submit
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
};

export { HeroBooking };
