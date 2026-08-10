import { useEffect } from "react";

export default function Booking() {
    useEffect(() => {
        async function fetchData(){
            const response = await fetch("/api/payment/create-checkout-session",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            const result = await response.json();

            if(response.ok){
                return result.url;
            }

            return null;
        }


        async function startCheckout(){
            const url = await fetchData();
            window.location.href = url;
        }

         startCheckout();
    },);

    return (
        <div>
            <h2>YO</h2>
        </div>
    );
}
