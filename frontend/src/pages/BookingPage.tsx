import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";

import { DatePickerDemo } from "@/components/DatePicker";
import { PeopleIcon } from "@/components/ui/icons/people-icon";
import { CabinIcon } from "@/components/ui/icons/cabin-icon";

const formSchema = z
    .object({
        checkIn: z.date(),
        checkOut: z.date(),
        guestAmount: z.number().min(1).max(4),
        cabin: z.string(),
        email: z.email(),
        firstName: z.string().min(2, { error: "i don't want your single letter name having ass in my cabin" }),
        lastName: z.string().min(2, { error: "Your name must have at least 2 letters" }),
        countryCode: z.string(),
        phone: z.string(),
        postNr: z.string().min(4, { error: "må være 4 tall" }).max(4, { error: "må være 4 tall" }),
        gateNavn: z.string()
    })
    .refine(data => data.checkOut.getTime() >= data.checkIn.getTime(), {
        message: "End date must be on or after start date",
        path: ["checkOut"] // Highlights the error on the endDate field
    });

export function BookingPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checkIn: new Date(),
            checkOut: new Date(),
            guestAmount: 1,
            cabin: "",
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            countryCode: "",
            postNr: "",
            gateNavn: ""
        },
        mode: "onChange"
    });
    // TODO: write this function
    function onSubmit(/*data: z.infer<typeof formSchema>*/) {
        console.log("TODO: do something cool here");
    }

    return (
        <div className="h-dvh w-dvw  bg-background flex flex-col items-center justify-center">
            <Card className="w-10/12 h-10/12 rounded-none bg-[#B8CBBE] overflow-y-scroll">
                <CardHeader>
                    <CardTitle>Book your stay</CardTitle>
                    {/* <CardDescription>Enter your email below to login to your account</CardDescription> */}
                    {/* <CardAction>
                        <Button variant="link">Sign Up</Button>
                    </CardAction> */}
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6">
                        <FieldGroup className="@container/field-group flex sm:flex-col md:flex-row h-auto items-start justify-around w-full">
                            <Controller
                                control={form.control}
                                name="checkIn"
                                render={({ field, fieldState }) => (
                                    <Field
                                        orientation="vertical"
                                        className="w-fit"
                                    >
                                        <FieldLabel className="font-light">Innsjekk</FieldLabel>
                                        <div className="h-14 w-fit">
                                            {/* TODO: maybe combine the two calendars to one with range selection */}
                                            <DatePickerDemo {...field} />
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
                                    <Field
                                        orientation="vertical"
                                        className="w-fit"
                                    >
                                        <FieldLabel className="font-light">Utsjekk</FieldLabel>
                                        <div className="h-14">
                                            {/* TODO: maybe combine the two calendars to one with range selection */}
                                            <DatePickerDemo {...field} />
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <FieldGroup className="@container/field-group flex flex-row gap-2 h-auto items-end justify-around">
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
                        </FieldGroup>
                        <FieldGroup className="@container/field-group flex flex-row gap-2 h-auto items-end">
                            <Controller
                                name="firstName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-input-username">First Name</FieldLabel>
                                        <Input
                                            {...field}

                                            aria-invalid={fieldState.invalid}
                                            placeholder="name"
                                            autoComplete="given-name"
                                            className="h-12 rounded-none border-2 border-solid border-[#2A3430]"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-input-username">Last Name</FieldLabel>
                                        <Input
                                            {...field}

                                            aria-invalid={fieldState.invalid}
                                            placeholder="last"
                                            autoComplete="family-name"
                                            className="h-12 rounded-none border-2 border-solid border-[#2A3430]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <FieldGroup className="flex sm:flex-col md:flex-row">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-input-username">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-input-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ola@nordman.no"
                                            autoComplete="email"
                                            className="h-12 rounded-none border-2 border-solid border-[#2A3430]"
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="countryCode"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="w-24"
                                    >
                                        <FieldLabel>Country Code</FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="+1"
                                            className="h-12 rounded-none border-2 border-solid border-[#2A3430]"
                                        />
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
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-input-username">Phone</FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-input-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="44444444"
                                            autoComplete="tel"
                                            className="h-12 rounded-none border-2 border-solid border-[#2A3430]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <FieldGroup className="flex flex-row">
                            <Controller
                                name="postNr"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="w-16"
                                    >
                                        <FieldLabel className="tracking-tighter">Postnummer</FieldLabel>
                                        <Input
                                            {...field}

                                            aria-invalid={fieldState.invalid}
                                            placeholder="0000"
                                            autoComplete="tel"
                                            className="h-12  rounded-none border-2 border-solid border-[#2A3430]"
                                        />
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
                                name="gateNavn"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Gatenavn</FieldLabel>
                                        <Input
                                            {...field}

                                            aria-invalid={fieldState.invalid}
                                            placeholder="lupinvegen 5"
                                            autoComplete="tel"
                                            className="h-12  rounded-none border-2 border-solid border-[#2A3430]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                className="absolute bottom-0"
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 grow">
                    <Button
                        type="submit"
                        form="hero-booking-form"
                        className="rounded-none h-14 px-12 mt-auto bg-[#44383E] text-[#BCE8EF]"
                    >
                        Book
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
