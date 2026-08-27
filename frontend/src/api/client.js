export async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error("something went wrong?");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
