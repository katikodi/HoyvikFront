import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider";
import App from "./app.tsx";

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
