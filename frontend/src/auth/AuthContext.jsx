import { useEffect, useState } from "react";
import AuthContext from "@/hooks/authContext.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.roles?.includes("admin") ?? false;

    async function fetchUser() {
        try {
            const response = await fetch("/api/auth/me", {
                credentials: "include"
            });

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();
            setUser(data);
        } catch {
            setUser(null);
        }
    }

    async function login(email, password) {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            console.log("login failed");
            return false;
        }

        await fetchUser();

        return true;
    }

    async function register(email, password, confirmPassword) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                confirmPassword
            })
        });

        if (!response.ok) return false;

        await login(email, password);

        return true;
    }

    async function logout() {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
    }

    useEffect(() => {
        fetchUser().finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAdmin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
