import { SignupForm } from "@/components/signup-form";
import { useAuth } from "@/hooks/authContext";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/register")({
    beforeLoad: ({ context }) => {
        if (context.auth.user) {
            throw redirect({
                to: "/"
            });
        }
    },
    component: RouteComponent
});

function RouteComponent() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function handleRegister(fullName, email, password, confirmPassword) {
        setError(null);

        const success = await register(fullName, email, password, confirmPassword);

        console.log("SUCCESS:", success);

        if (success) {
            await navigate({ to: "/" });
        } else {
            setError("Something went wrong");
        }
    }
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a
                        href="#"
                        className="flex items-center gap-2 font-medium"
                    >
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Acme Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignupForm
                            onRegister={handleRegister}
                            error={error}
                        />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
