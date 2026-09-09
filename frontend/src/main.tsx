import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider";
import App from "./app.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { queryClient } from "./lib/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
