import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { myBookingsQuery } from "@/queries/booking.queries";
import { api } from "@/services/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldDescription, FieldLabel, Field } from "@/components/ui/field";
import { queryClient } from "@/lib/queryClient";
import { currentUserQuery } from "@/queries/auth.queries";

export default function ProfileComponent() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const updateProfile = useMutation({
        mutationFn: async data => {
            await api.patch("/auth/me", data);
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: currentUserQuery.queryKey
            });
        }
    });

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }
    }, [user]);
    useEffect(() => {
        if (!user) {
            navigate({ to: "/login" });
        }
    }, [user, navigate]);

    if (!user) return null;

    async function onSubmit(e) {
        e.preventDefault();
        await updateProfile.mutateAsync({
            firstName,
            lastName
        });
    }

    function onDiscard(e) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        e.currentTarget.form.reset();
    }
    return (
        <section className="w-full flex justify-center items-center">
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-8 bg-primary p-8 rounded-2xl text-white"
            >
                <div className="flex flex-row gap-8">
                    <Field>
                        <FieldLabel htmlFor="input-field-first-name">First Name</FieldLabel>
                        <Input
                            id="input-field-first-name"
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <FieldDescription>Enter your first name.</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="input-field-last-name">Last Name</FieldLabel>
                        <Input
                            id="input-field-last-name"
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                        <FieldDescription>Enter your last name.</FieldDescription>
                    </Field>
                </div>
                <div className="flex flex-row gap-8 justify-between">
                    <Button
                        type="submit"
                        variant={"secondary"}
                        disabled={updateProfile.isPending}
                    >
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        type="button"
                        variant={"destructive"}
                        onClick={onDiscard}
                    >
                        Discard
                    </Button>
                </div>
            </form>
        </section>
    );
}
