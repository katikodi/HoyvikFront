import ReactProfiler from "@/components/ReactProfiler";
import SuccessfulPaymentPage from "@/pages/SuccessfulPaymentPage.jsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_index/payment/payment-success")({
    validateSearch: search => ({
        session_id: typeof search.session_id === "string" ? search.session_id : undefined
    }),
    component: () => {
        const { session_id } = Route.useSearch();

        return (
            <ReactProfiler id="PaymentSuccess">
                <SuccessfulPaymentPage sessionId={session_id} />
            </ReactProfiler>
        );
    }
});
