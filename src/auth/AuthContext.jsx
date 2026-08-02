import {  createContext,  useContext, useEffect,  useState } from "react";

const AuthContext = createContext(null);

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
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            return false;
        }

        await fetchUser();

        return true;
    }


    async function register(email, password) {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (response.ok) {
            await login(email, password);
        }

        return response.ok;
    }


    async function logout() {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
    }


    useEffect(() => {
        fetchUser()
            .finally(() => setLoading(false));
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
            }} >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}