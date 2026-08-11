import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import "@/style.css";
import Nav from "@/components/Nav";

export default function MainLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
                // overflowX: "clip"
            }}
        >
            <header>
                {/* Why blocker?? */}
                {/* <div className="blocker"></div> */}
                <Nav />
                {/* <NavBar /> */}
            </header>

            <main style={{ flex: 1, width: "100%", height: "100%" }}>
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}
