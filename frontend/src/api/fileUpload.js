import { apiFetch } from "./client";

export function uploadImage(image) {
    if (!(image instanceof FormData)) {
        throw new Error("'image' must be an instance of FormData");
    }

    console.log("Upload Image:", image);
    return apiFetch("/api/uploads", {
        method: "POST",
        body: image
    });
}

export function uploadHero(image) {
    if (!(image instanceof FormData)) {
        throw new Error("'image' must be an instance of FormData");
    }
    console.log("Upload Image:", image);
    return apiFetch("/api/uploads/hero", {
        method: "POST",
        body: image
    });
}

export function uploadIcon(image) {
    if (!(image instanceof FormData)) {
        throw new Error("'image' must be an instance of FormData");
    }
    console.log("Upload Image:", image);
    return apiFetch("/api/uploads/icons", {
        method: "POST",
        body: image
    });
}
