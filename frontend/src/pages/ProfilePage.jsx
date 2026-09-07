import { useAuth } from "@/hooks/authContext";

export default function ProfileComponent() {
    const { user } = useAuth();

    return <h1>hello {user.email}</h1>;
}
