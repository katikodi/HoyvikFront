import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/authContext";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
    beforeLoad: ({ context }) => {
        if (context.auth.user) {
            throw redirect({
                to: "/"
            });
        }
    },
    component: LoginComponent
});

function LoginComponent() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    async function handleLogin(email, password) {
        setError(null);
        const success = await login(email, password);
        if (success) {
            await navigate({ to: "/" });
        } else {
            setError("Invalid email or password");
        }
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm
                    onLogin={handleLogin}
                    error={error}
                />
            </div>
        </div>
    );
}
