import { useEffect, useState } from "react";
export default function Admin() {
    const [users, setUsers] = useState(null);

    async function fetchUsers() {
        const response = await fetch("/api/admin/users", {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            setUsers(null);
            return;
        }

        const data = await response.json();
        setUsers(data.users);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    if (!users) return <p>No users</p>;

    return (
        <ul>
            {users.map(user => (
                <User
                    key={user.id}
                    user={user}
                />
            ))}
        </ul>
    );
}

function User({ user }) {
    const { id, userName, email } = user;
    return (
        <li style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <h3>{userName}</h3>
            <p>{email}</p>
            <small>{id}</small>
        </li>
    );
}
