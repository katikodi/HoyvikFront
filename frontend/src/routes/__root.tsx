import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
    <div>
        <Outlet />
        <TanStackRouterDevtools />
    </div>
);

function NotFound() {
    return (
        <div>
            <h1>404</h1>
            <p>The page you're looking for doesn't exist.</p>
        </div>
    );
}

export const Route = createRootRoute({
    component: RootLayout,
    notFoundComponent: NotFound
});
