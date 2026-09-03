import { Button } from "@/components/ui/button";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";

export function App() {
    const { login, user } = useAuth();

    return (
        <button
            onClick={async () => {
                await login("admin@admin.com", "admin@admin.com");
                console.log(user);
            }}
        >
            Login
        </button>
    );
}

export default App;
