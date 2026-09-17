import { Toaster } from "@/components/ui/sonner";

import { Outlet } from "@tanstack/react-router";
export function AdminLayout() {
  return (
    <div>
      <header>
        <h1>ADMIN LAYOUT</h1>
      </header>

      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
