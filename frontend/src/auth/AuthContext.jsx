import { useEffect, useState } from "react";
import AuthContext from "@/hooks/authContext.js";
import { getCurrentUser, login as loginUser, register as registerUser, logout as logoutUser } from "@/api/auth";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.roles?.includes("admin") ?? false;

    async function fetchUser() {
        try {
            const user = await getCurrentUser();
            setUser(user);
        } catch {
            setUser(null);
        }
    }

    async function login(email, password) {
        try {
            await loginUser(email, password);
            await fetchUser();
            return true;
        } catch {
            return false;
        }
    }

    async function register(email, password, confirmPassword) {
        try {
            await registerUser(email, password, confirmPassword);
            await login(email, password);
            return true;
        } catch {
            return false;
        }
    }

    async function logout() {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
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
