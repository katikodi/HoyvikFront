import { useContext } from "react";
import AuthContext from "@/hooks/authContext.js";

export default function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
