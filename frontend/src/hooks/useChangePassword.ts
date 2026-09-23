import { ApiException } from "@/services/ApiException";
import { api } from "@/services/client";
import { useMutation } from "@tanstack/react-query";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useChangePassword() {
  return useMutation<void, ApiException, ChangePasswordRequest>({
    mutationFn: async (data) => {
      await api.post("/auth/change-password", data);
    },
  });
}
