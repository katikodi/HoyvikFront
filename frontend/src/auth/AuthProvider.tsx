import { useEffect, useState, type ReactNode } from "react";
import AuthContext, { type User } from "@/hooks/authContext";

import { getCurrentUser, login as loginUser, register as registerUser, logout as logoutUser } from "@/services/auth";

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.roles?.includes("admin") ?? false;

    async function fetchUser(): Promise<User | null> {
        try {
            const user: User = await getCurrentUser();
            setUser(user);
            return user;
        } catch {
            setUser(null);
            return null;
        }
    }

    async function login(email: string, password: string): Promise<boolean> {
        try {
            await loginUser(email, password);
            const user = await fetchUser();
            return user !== null;
        } catch {
            return false;
        }
    }

    async function register(email: string, password: string, confirmPassword: string) {
        try {
            await registerUser(email, password, confirmPassword);
            await fetchUser();
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
