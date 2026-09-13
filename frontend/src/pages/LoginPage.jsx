import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks/authContext";
import { resendVerification } from "@/services/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [errorCode, setErrorCode] = useState(null);
    const [resendState, setResendState] = useState("idle"); // idle | sending | sent

    async function handleLogin(email, password) {
        setError(null);
        setErrorCode(null);
        const result = await login(email, password);
        if (result.success) {
            await navigate({ to: "/" });
        } else {
            console.log(result);
            setError(result.message);
            setErrorCode(result.error);
        }
    }

    async function handleResend(email) {
        setResendState("sending");
        await resendVerification(email);
        setResendState("sent");
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm
                    onLogin={handleLogin}
                    error={error}
                    errorCode={errorCode}
                    onResend={handleResend}
                    resendState={resendState}
                />
            </div>
        </div>
    );
}
