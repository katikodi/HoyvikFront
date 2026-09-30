import { createRootRouteWithContext } from "@tanstack/react-router";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";
import type { User } from "@/types/user";
import type { QueryClient } from "@tanstack/react-query";
interface RouterContext {
    auth: {
        user: User | null;
        loading: boolean;
    };
    queryClient: QueryClient;
}

//TODO: Remove this in production, this is just for testing purposes
export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
    notFoundComponent: NotFoundPage,
    beforeLoad: async ({ context }) => {
        const user = context.auth.user;
        return { user };
    }
});
