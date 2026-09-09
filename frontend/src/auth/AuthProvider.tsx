import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AuthContext from "@/hooks/authContext";
import { login as loginUser, logout as logoutUser, register as registerUser } from "@/services/auth";

import { currentUserQuery } from "../queries/auth.queries";

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();

    const userQuery = useQuery(currentUserQuery);

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: currentUserQuery.queryKey
            });
        }
    });

    const registerMutation = useMutation({
        mutationFn: ({
            fullName,
            email,
            password,
            confirmPassword
        }: {
            fullName: string;
            email: string;
            password: string;
            confirmPassword: string;
        }) => registerUser(fullName, email, password, confirmPassword),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: currentUserQuery.queryKey
            });
        }
    });

    const logoutMutation = useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {
            queryClient.setQueryData(currentUserQuery.queryKey, null);
        }
    });

    const user = userQuery.data ?? null;

    const value = {
        user,

        loading: userQuery.isLoading,

        isAdmin: user?.roles?.includes("admin") ?? false,

        login: async (email: string, password: string) => {
            try {
                await loginMutation.mutateAsync({
                    email,
                    password
                });

                return true;
            } catch {
                return false;
            }
        },

        register: async (fullName: string, email: string, password: string, confirmPassword: string) => {
            try {
                await registerMutation.mutateAsync({
                    fullName,
                    email,
                    password,
                    confirmPassword
                });

                return true;
            } catch {
                return false;
            }
        },

        logout: async () => {
            try {
                await logoutMutation.mutateAsync();
            } catch {
                // We still clear the local auth state below.
            } finally {
                queryClient.setQueryData(currentUserQuery.queryKey, null);
            }
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
