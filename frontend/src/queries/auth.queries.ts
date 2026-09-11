import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import type { User } from "@/hooks/authContext";
import { getCurrentUser } from "@/services/auth";

export const currentUserQuery = queryOptions<User | null>({
    queryKey: ["auth", "me"],

    queryFn: async (): Promise<User | null> => {
        try {
            return await getCurrentUser();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return null;
            }

            throw error;
        }
    }
});
