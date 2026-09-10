import { useRouteContext } from "@tanstack/react-router";
export default function ProfilePage() {
    const user = useRouteContext({
        from: "/profile/",
        select: context => context.user
    });

    return (
        <div>
            <h1>
                hello <strong>{user.email}</strong>
            </h1>
        </div>
    );
}
