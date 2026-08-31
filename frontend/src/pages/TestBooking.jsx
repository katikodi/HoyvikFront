import { useEffect } from "react";

export default function TestBooking() {
    async function submit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        const startDate = formData.get("start-date");
        const endDate = formData.get("end-date");

        const response = await fetch("/api/payment/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ checkin: startDate, checkout: endDate, numberOfGuests: 1 })
        });
    }

    // useEffect(() => {
    //     const controller = new AbortController();
    //     let timeoutId;

    //     async function startCheckout() {
    //         const response = await fetch("/api/payment/create-checkout-session", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: "include",
    //             signal: controller.signal
    //         });

    //         const result = await response.json();

    //         if (!response.ok || !result.url) return;

    //         timeoutId = setTimeout(() => {
    //             window.location.href = result.url;
    //         }, 1000);
    //     }

    //     startCheckout().catch(error => {
    //         if (error.name !== "AbortError") {
    //             console.error(error);
    //         }
    //     });

    //     return () => {
    //         clearTimeout(timeoutId);
    //         controller.abort();
    //     };
    // }, []); // <-- important

    return (
        <form onSubmit={submit}>
            <label htmlFor="start-date">Start Date</label>
            <input
                type="date"
                id="start-date"
                name="start-date"
            />
            <label htmlFor="end-date">End Date</label>
            <input
                type="date"
                id="end-date"
                name="end-date"
            />
            <button type="submit">Submit</button>
        </form>
    );
}
