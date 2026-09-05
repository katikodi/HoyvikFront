import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./hooks/authContext";

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
        auth: undefined!
    }
});

// Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    const auth = useAuth();

    if (auth.loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    return (
        <RouterProvider
            router={router}
            context={{ auth }}
        />
    );
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
