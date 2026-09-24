import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import { getCurrentUser } from "@/services/auth";
import type { User } from "@/types/user";

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
  },
});
