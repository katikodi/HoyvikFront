import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/authContext";
import { myBookingsQuery } from "@/queries/booking.queries";
import { api } from "@/services/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FieldDescription, FieldLabel, Field } from "@/components/ui/field";

export default function ProfileComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate({ to: "/login" });
  }

  console.log("User: ", user);
  return (
    <section className="w-full flex justify-center items-center">
      <form className="flex flex-col gap-8 bg-primary p-8 rounded-2xl text-white">
        <Email user={user} />
        <FullName user={user} />

        <div className="flex flex-row gap-8 justify-between">
          <Button variant={"secondary"}>Save Changes</Button>
          <Button type="button" variant={"destructive"}>
            Discard
          </Button>
        </div>
      </form>
    </section>
  );
}

function Email({ user }) {
  return (
    <div className="flex flex-row">
      <Field>
        <FieldLabel htmlFor="input-field-email">Email</FieldLabel>
        <Input id="input-field-email" type="text" placeholder={user.email} />
        <FieldDescription>Enter your email.</FieldDescription>
      </Field>
    </div>
  );
}

function FullName({ user }) {
  return (
    <div className="flex flex-row gap-8">
      <Field>
        <FieldLabel htmlFor="input-field-first-name">First Name</FieldLabel>
        <Input
          id="input-field-first-name"
          type="text"
          placeholder={user.fullName}
        />
        <FieldDescription>Enter your first name.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="input-field-last-name">Last Name</FieldLabel>
        <Input
          id="input-field-last-name"
          type="text"
          placeholder={user.fullName}
        />
        <FieldDescription>Enter your first name.</FieldDescription>
      </Field>
    </div>
  );
}
