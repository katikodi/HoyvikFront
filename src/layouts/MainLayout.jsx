import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header>
        <NavBar />
      </header>

      <main style={{ flex: 1, border:"1px solid white" }}>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}