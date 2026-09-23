import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/useChangePassword";
import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/change-password")({
  component: ChangePassword,
});

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate, isPending, isSuccess, error } = useChangePassword();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    if (newPassword !== confirmPassword) {
      setLocalError("New password and confirmation do not match.");
      return;
    }

    mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col space-y-4  align-middle justify-center items-center"
    >
      <div className="flex-col gap-8 bg-primary p-8 rounded-2xl space-y-2">
        <div className="flex flex-col gap-8 [&>div]:flex [&>div]:flex-col">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        {localError && <p className="error">{localError}</p>}

        {error && !error.isValidation() && (
          <p className="error">{error.message}</p>
        )}

        {error?.isValidation() && (
          <ul className="error-list">
            {Object.entries(error.fieldErrors!).map(([field, messages]) => (
              <li key={field}>{messages.join(", ")}</li>
            ))}
          </ul>
        )}

        {isSuccess && <p className="success">Password changed successfully.</p>}

        <Button variant={"outline"} type="submit" disabled={isPending}>
          {isPending ? "Changing password..." : "Change password"}
        </Button>
      </div>
    </form>
  );
}
