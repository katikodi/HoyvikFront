import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export default function RootLayout() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
}
