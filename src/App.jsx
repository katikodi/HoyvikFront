import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


export default function App() {

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}