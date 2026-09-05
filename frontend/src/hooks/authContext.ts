import { createContext, useContext } from "react";

export type User = {
    fullName: string;
    id: number;
    email: string;
    roles: string[];
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

export default AuthContext;
