import "@/style.css";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminBar from "@/components/AdminBar";
import Nav from "@/components/Nav";

export default function AdminLayout() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "clip"
            }}
        >
            <header>
                <Nav />
                {/* <AdminBar /> */}
            </header>

            <main style={{ flex: 1, border: "1px solid white", width: "100%", height: "100%", overflow: "clip" }}>
                <Outlet />
            </main>
        </div>
    );
}
