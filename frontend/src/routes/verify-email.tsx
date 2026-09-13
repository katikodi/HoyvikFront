import { api } from "@/services/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/verify-email")({
    validateSearch: search => ({
        userId: String(search.userId ?? ""),
        token: String(search.token ?? "")
    }),

    component: VerifyEmailPage
});
type VerificationState = { status: "loading" } | { status: "success" } | { status: "error"; message: string };

function VerifyEmailPage() {
    const search = Route.useSearch();

    const [state, setState] = useState<VerificationState>({
        status: "loading"
    });

    useEffect(() => {
        async function verifyEmail() {
            if (!search.userId || !search.token) {
                setState({
                    status: "error",
                    message: "This verification link is invalid or incomplete."
                });
                return;
            }

            try {
                const response = await api.get(
                    `/auth/verify-email?userId=${encodeURIComponent(search.userId)}&token=${encodeURIComponent(search.token)}`
                );

                if (!response.data) {
                    setState({
                        status: "error",
                        message: "We could not verify your email. The link may have expired or already been used."
                    });
                    return;
                }

                setState({
                    status: "success"
                });
            } catch {
                setState({
                    status: "error",
                    message: "Something went wrong while verifying your email. Please try again later."
                });
            }
        }

        verifyEmail();
    }, [search.userId, search.token]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                    {state.status === "loading" && <LoadingState />}

                    {state.status === "success" && <SuccessState />}

                    {state.status === "error" && <ErrorState message={state.message} />}
                </div>
            </div>
        </main>
    );
}

function LoadingState() {
    return (
        <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                    className="h-8 w-8 animate-spin text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />

                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">Verifying your email</h1>

            <p className="mt-2 text-gray-500">Please wait while we verify your email address.</p>
        </>
    );
}

function SuccessState() {
    return (
        <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <svg
                    className="h-8 w-8 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">Email verified!</h1>

            <p className="mt-2 text-gray-500">Your email address has been successfully verified.</p>

            <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
            >
                Continue to login
            </Link>
        </>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg
                    className="h-8 w-8 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">Verification failed</h1>

            <p className="mt-2 text-gray-500">{message}</p>

            <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
                Back to login
            </Link>
        </>
    );
}
