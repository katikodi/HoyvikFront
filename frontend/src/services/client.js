export async function apiFetch(url, options = {}) {
    const headers = {
        ...options.headers
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] ??= "application/json";
    }

    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers
    });

    if (!response.ok) {
        throw new Error("something went wrong?");
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}
