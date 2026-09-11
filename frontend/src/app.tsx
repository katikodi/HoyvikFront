import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/authContext";
import { Spinner } from "./components/ui/spinner";
import { queryClient } from "@/lib/queryClient";

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    notFoundMode: "root",
    context: {
        auth: undefined!,
        queryClient
    }
});

// Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    const auth = useAuth();
    if (auth.loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="size-20" />
            </div>
        );

    return (
        <RouterProvider
            router={router}
            context={{ auth, queryClient }}
        />
    );
}
