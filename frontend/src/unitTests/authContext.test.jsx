import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/auth/AuthContext";
import { getCurrentUser } from "@/api/auth";
import useAuth from "@/hooks/useAuth";

vi.mock("@/api/auth", () => ({
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
}));

function TestComponent() {
    const { user, loading } = useAuth();

    return (
        <>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="user">{user?.email ?? "No user"}</span>
        </>
    );
}

describe("AuthContext", () => {
    it("loads the current user", async () => {
        getCurrentUser.mockResolvedValue({
            id: 1,
            email: "lmao@xd.com",
            roles: ["user"]
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("user")).toHaveTextContent("lmao@xd.com");
        });

        expect(getCurrentUser).toHaveBeenCalledOnce();
    });
});
