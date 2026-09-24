import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FieldDescription, FieldLabel, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/authContext";
import { api } from "@/services/client";

export const Route = createFileRoute("/profile/change-password")({
    component: ProfileComponent
});

export default function ProfileComponent() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate({ to: "/login" });
    }

    async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const currentPassword = formData.get("input-field-current");
        const newPassword = formData.get("input-field-new");
        const confirmPassword = formData.get("input-field-confirm");
        try {
            await api.post("/auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword
            });
        } catch (error) {}
    }
    return (
        <section className="w-full flex justify-center items-center">
            <form
                onSubmit={onSubmit}
                className="flex flex-col gap-8 bg-primary p-8 rounded-2xl text-white"
            >
                <div className="flex flex-col gap-8">
                    <Field>
                        <FieldLabel htmlFor="input-field-current">Current password</FieldLabel>
                        <Input
                            id="input-field-current"
                            name="input-field-current"
                            type="text"
                        />
                        <FieldDescription>Enter your old password.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="input-field-new">New password</FieldLabel>
                        <Input
                            id="input-field-new"
                            name="input-field-new"
                            type="text"
                        />
                        <FieldDescription>Enter your new password.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="input-field-confirm">Confirm password</FieldLabel>
                        <Input
                            id="input-field-confirm"
                            name="input-field-confirm"
                            type="text"
                        />
                        <FieldDescription>Enter your new password again.</FieldDescription>
                    </Field>
                </div>
                <div className="flex flex-row gap-8 justify-between">
                    <Button variant={"secondary"}>Save Changes</Button>
                    <Button
                        type="button"
                        variant={"destructive"}
                    >
                        Discard
                    </Button>
                </div>
            </form>
        </section>
    );
}
