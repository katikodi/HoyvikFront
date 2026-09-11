import { Outlet } from "@tanstack/react-router";

export function AdminLayout() {
    return (
        <div>
            <header>
                <h1>ADMIN LAYOUT</h1>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
