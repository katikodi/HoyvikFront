import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Outlet } from "@tanstack/react-router";
import { StrictMode } from "react";

export default function RootLayout() {
    return (
        <StrictMode>
            <Outlet />
            <TanStackRouterDevtools />
            {/* <HamburgerDropdown /> */}
        </StrictMode>
    );
}
