import { useEffect } from "react";
export default function Booking() {
    useEffect(() => {
        const controller = new AbortController();
        let timeoutId;

        async function startCheckout() {
            const response = await fetch("/api/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                signal: controller.signal
            });

            const result = await response.json();

            if (!response.ok || !result.url) return;

            timeoutId = setTimeout(() => {
                window.location.href = result.url;
            }, 5000);
        }

        startCheckout().catch(error => {
            if (error.name !== "AbortError") {
                console.error(error);
            }
        });

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    return <div>You are being redirected....</div>;
}
