import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools />
            {/* <HamburgerDropdown /> */}
        </>
    );
}
