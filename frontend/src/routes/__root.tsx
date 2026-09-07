import { createRootRoute } from "@tanstack/react-router";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";

export const Route = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFoundPage
});
