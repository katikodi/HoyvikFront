import { Button } from "@/components/ui/button";
import useAuth from "./hooks/useAuth";

export function App() {
    const { login, user } = useAuth();

    return (
        <>
            <Button
                onClick={async () => {
                    await login("admin@admin.com", "admin@admin.com");
                    console.log(user);
                }}
            >
                Login
            </Button>
        </>
    );
}

export default App;
