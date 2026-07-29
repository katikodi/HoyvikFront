import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { AdminBar } from "@/components";
import '../style.css';

export default function AdminLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header>
        <AdminBar/>
      </header>

      <main style={{ flex: 1, border:"1px solid white" }}>
        <Outlet />
      </main>
    </div>
  );
}