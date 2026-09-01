import { describe, expect, it, vi, beforeEach } from "vitest";
import { apiFetch } from "@/api/client.js";

describe("apiFetch", () => {
    it("returns JSON when the request succeeds", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue({ message: "success" })
            })
        );
        await expect(apiFetch("/api/test")).resolves.toEqual({
            message: "success"
        });
    });

    it("throws when the response is not ok", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            })
        );
        await expect(apiFetch("/api/test")).rejects.toThrow("something went wrong?");
    });

    it("returns null for a 204 response", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                status: 204
            })
        );
        await expect(apiFetch("/api/test")).resolves.toBeNull();
    });
});
