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
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                overflowX: "clip"
            }}
        >
            <header>
                <Nav />
                <div className="blocker"></div>
                {/* <AdminBar /> */}
            </header>

            <main style={{ flex: 1, border: "1px solid white", width: "100%", height: "100%" }}>
                <Outlet />
            </main>
        </div>
    );
}
