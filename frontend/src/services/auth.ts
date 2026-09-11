import type { User } from "@/hooks/authContext";
import { api } from "./client";

export async function getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    return data;
}

export async function login(email: string, password: string): Promise<void> {
    await api.post("/auth/login", {
        email,
        password
    });
}

export async function register(fullName: string, email: string, password: string, confirmPassword: string): Promise<void> {
    await api.post("/auth/register", {
        fullName,
        email,
        password,
        confirmPassword
    });
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout");
}
