import { apiFetch } from "./client";

export function getCurrentUser() {
    return apiFetch("/api/auth/me");
}

export function login(email, password) {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export function register(fullName, email, password, confirmPassword) {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
            fullName,
            email,
            password,
            confirmPassword
        })
    });
}

export function logout() {
    return apiFetch("/api/auth/logout", {
        method: "POST"
    });
}
