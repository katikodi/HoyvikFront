import ReactDOM from "react-dom/client";
import "@/index.css";
import { AuthProvider } from "@/auth/AuthProvider";
import App from "@/app";
import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import ReactProfiler from "./components/ReactProfiler.tsx";

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <ReactProfiler id="App">
                        <App />
                    </ReactProfiler>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
