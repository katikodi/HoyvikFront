import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
    component: RouteComponent,
    validateSearch: search => ({
        token: String(search.token ?? "")
    })
});

function RouteComponent() {
    const search = Route.useSearch();

    if (search.token) {
        return <>Reset</>;
    }
}
