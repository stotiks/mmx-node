import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPermissionModule } from "./createPermissionModule.js";

describe("createPermissionModule", () => {
    let eventModule;
    let permissionModule;
    let consoleErrorSpy;

    beforeEach(() => {
        eventModule = {
            emit: vi.fn(),
        };

        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const requireUnlocked = vi.fn(); // Mock requireUnlocked function
        permissionModule = createPermissionModule({ eventModule, requireUnlocked });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("initialization", () => {
        it("should throw if eventModule is missing", () => {
            expect(() => createPermissionModule()).toThrow("Event module is required");
            expect(() => createPermissionModule({})).toThrow("Event module is required");
            expect(() => createPermissionModule({ eventModule: null })).toThrow("Event module is required");
        });

        it("should throw if eventModule.emit is not a function", () => {
            expect(() => createPermissionModule({ eventModule: {} })).toThrow("Event module is required");
            expect(() => createPermissionModule({ eventModule: { emit: 123 } })).toThrow("Event module is required");
        });

        it("should initialize with empty permissions", () => {
            expect(permissionModule.getAllowedOrigins()).toEqual([]);
            expect(permissionModule.getPermissionCount()).toBe(0);
        });
    });

    describe("checkUrlPermissionsAsync", () => {
        it("should return false when no permission exists", async () => {
            await expect(permissionModule.checkUrlPermissionsAsync("https://example.com")).resolves.toBe(false);
        });

        it("should return true after allowUrlAsync for same origin", async () => {
            await permissionModule.allowUrlAsync("https://example.com/path");

            await expect(permissionModule.checkUrlPermissionsAsync("https://example.com/other")).resolves.toBe(true);
        });

        it("should check by origin (path/query/hash do not matter)", async () => {
            await permissionModule.allowUrlAsync("https://example.com/a?x=1#h");

            await expect(permissionModule.checkUrlPermissionsAsync("https://example.com/b?y=2#z")).resolves.toBe(true);
        });

        it("should not match different protocol", async () => {
            await permissionModule.allowUrlAsync("https://example.com");

            await expect(permissionModule.checkUrlPermissionsAsync("http://example.com")).resolves.toBe(false);
        });

        it("should not match different port", async () => {
            await permissionModule.allowUrlAsync("https://example.com:443");

            await expect(permissionModule.checkUrlPermissionsAsync("https://example.com:444")).resolves.toBe(false);
        });

        it("should not match different subdomain", async () => {
            await permissionModule.allowUrlAsync("https://example.com");

            await expect(permissionModule.checkUrlPermissionsAsync("https://sub.example.com")).resolves.toBe(false);
        });

        it("should return false and log error for invalid URL", async () => {
            await expect(permissionModule.checkUrlPermissionsAsync("not a url")).resolves.toBe(false);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Permission: Invalid URL provided to checkUrlPermissionsAsync:",
                expect.any(Error)
            );
        });

        it("should return false and log error for unsafe protocol", async () => {
            await expect(permissionModule.checkUrlPermissionsAsync("file:///tmp/a")).resolves.toBe(false);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Permission: Invalid URL provided to checkUrlPermissionsAsync:",
                expect.any(Error)
            );
        });
    });

    describe("allowUrlAsync", () => {
        it("should add origin and emit permission-granted", async () => {
            await permissionModule.allowUrlAsync("https://example.com/path");

            expect(permissionModule.getPermissionCount()).toBe(1);
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(true);
            expect(eventModule.emit).toHaveBeenCalledWith("permission-granted", { origin: "https://example.com" });
        });

        it("should be idempotent on same origin", async () => {
            await permissionModule.allowUrlAsync("https://example.com/a");
            await permissionModule.allowUrlAsync("https://example.com/b");

            expect(permissionModule.getPermissionCount()).toBe(1);
            expect(eventModule.emit).toHaveBeenCalledTimes(2);
        });

        it("should allow multiple different origins", async () => {
            await permissionModule.allowUrlAsync("https://example.com");
            await permissionModule.allowUrlAsync("https://github.com");

            expect(permissionModule.getPermissionCount()).toBe(2);
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(true);
            expect(permissionModule.hasOriginPermission("https://github.com")).toBe(true);
        });

        it("should throw and log for invalid URL", async () => {
            await expect(permissionModule.allowUrlAsync("not a url")).rejects.toThrow(/Invalid URL:/);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Permission: Failed to allow URL:", expect.any(Error));

            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(eventModule.emit).not.toHaveBeenCalledWith("permission-granted", expect.anything());
        });

        it("should throw for unsafe protocol", async () => {
            await expect(permissionModule.allowUrlAsync("ftp://example.com")).rejects.toThrow(
                /Unsafe protocol not allowed/
            );
        });
    });

    describe("revokeUrlAsync", () => {
        it("should remove origin and emit permission-revoked", async () => {
            await permissionModule.allowUrlAsync("https://example.com/a");

            await permissionModule.revokeUrlAsync("https://example.com/b");

            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(false);
            expect(eventModule.emit).toHaveBeenCalledWith("permission-revoked", { origin: "https://example.com" });
        });

        it("should be safe to revoke origin that was never granted (still emits)", async () => {
            await permissionModule.revokeUrlAsync("https://example.com");

            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(eventModule.emit).toHaveBeenCalledWith("permission-revoked", { origin: "https://example.com" });
        });

        it("should throw and log for invalid URL", async () => {
            await expect(permissionModule.revokeUrlAsync("not a url")).rejects.toThrow(/Invalid URL:/);

            expect(consoleErrorSpy).toHaveBeenCalledWith("Permission: Failed to revoke URL:", expect.any(Error));
        });

        it("should throw for unsafe protocol", async () => {
            await expect(permissionModule.revokeUrlAsync("file:///tmp/a")).rejects.toThrow(
                /Unsafe protocol not allowed/
            );
        });

        it("should revoke only the specified origin and keep others", async () => {
            await permissionModule.allowUrlAsync("https://example.com");
            await permissionModule.allowUrlAsync("https://github.com");

            await permissionModule.revokeUrlAsync("https://example.com/some-path");

            expect(permissionModule.getPermissionCount()).toBe(1);
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(false);
            expect(permissionModule.hasOriginPermission("https://github.com")).toBe(true);
        });
    });

    describe("getAllowedOrigins", () => {
        it("should return an array copy", async () => {
            await permissionModule.allowUrlAsync("https://example.com");
            const origins1 = permissionModule.getAllowedOrigins();
            const origins2 = permissionModule.getAllowedOrigins();

            expect(Array.isArray(origins1)).toBe(true);
            expect(origins1).toEqual(["https://example.com"]);
            expect(origins2).toEqual(["https://example.com"]);

            // mutate returned array should not affect internal storage
            origins1.push("https://evil.com");
            expect(permissionModule.hasOriginPermission("https://evil.com")).toBe(false);
        });
    });

    describe("clearAllPermissions", () => {
        it("should clear all origins and emit all-permissions-cleared", async () => {
            await permissionModule.allowUrlAsync("https://example.com");
            await permissionModule.allowUrlAsync("https://github.com");

            permissionModule.clearAllPermissions();

            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(permissionModule.getAllowedOrigins()).toEqual([]);
            expect(eventModule.emit).toHaveBeenCalledWith("all-permissions-cleared");
        });

        it("should work when already empty", () => {
            permissionModule.clearAllPermissions();
            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(eventModule.emit).toHaveBeenCalledWith("all-permissions-cleared");
        });
    });

    describe("getPermissionCount", () => {
        it("should reflect unique origin count", async () => {
            expect(permissionModule.getPermissionCount()).toBe(0);

            await permissionModule.allowUrlAsync("https://example.com/a");
            await permissionModule.allowUrlAsync("https://example.com/b");
            await permissionModule.allowUrlAsync("https://github.com");

            expect(permissionModule.getPermissionCount()).toBe(2);

            await permissionModule.revokeUrlAsync("https://example.com");
            expect(permissionModule.getPermissionCount()).toBe(1);
        });
    });

    describe("hasOriginPermission", () => {
        it("should return false for invalid input", () => {
            expect(permissionModule.hasOriginPermission("")).toBe(false);
            expect(permissionModule.hasOriginPermission(null)).toBe(false);
            expect(permissionModule.hasOriginPermission(undefined)).toBe(false);
            expect(permissionModule.hasOriginPermission(123)).toBe(false);
        });

        it("should return true for allowed origin", async () => {
            await permissionModule.allowUrlAsync("https://example.com/path");
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(true);
        });
    });

    describe("addOrigin", () => {
        it("should throw for invalid input", () => {
            expect(() => permissionModule.addOrigin("")).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.addOrigin(null)).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.addOrigin(undefined)).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.addOrigin(123)).toThrow("Origin must be a non-empty string");
        });

        it("should add origin directly without URL validation", () => {
            permissionModule.addOrigin("chrome-extension://abcdef");
            expect(permissionModule.hasOriginPermission("chrome-extension://abcdef")).toBe(true);
            expect(permissionModule.getPermissionCount()).toBe(1);
        });

        it("should be idempotent", () => {
            permissionModule.addOrigin("https://example.com");
            permissionModule.addOrigin("https://example.com");
            expect(permissionModule.getPermissionCount()).toBe(1);
        });
    });

    describe("removeOrigin", () => {
        it("should throw for invalid input", () => {
            expect(() => permissionModule.removeOrigin("")).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.removeOrigin(null)).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.removeOrigin(undefined)).toThrow("Origin must be a non-empty string");
            expect(() => permissionModule.removeOrigin(123)).toThrow("Origin must be a non-empty string");
        });

        it("should remove origin directly", () => {
            permissionModule.addOrigin("https://example.com");
            expect(permissionModule.getPermissionCount()).toBe(1);

            permissionModule.removeOrigin("https://example.com");
            expect(permissionModule.getPermissionCount()).toBe(0);
            expect(permissionModule.hasOriginPermission("https://example.com")).toBe(false);
        });

        it("should be safe to remove non-existent origin", () => {
            expect(() => permissionModule.removeOrigin("https://example.com")).not.toThrow();
            expect(permissionModule.getPermissionCount()).toBe(0);
        });
    });

    describe("closure-based private storage", () => {
        it("should maintain separate permission storage per instance", async () => {
            const eventModule2 = { emit: vi.fn() };
            const requireUnlocked1 = vi.fn();
            const requireUnlocked2 = vi.fn();
            const module1 = createPermissionModule({ eventModule, requireUnlocked: requireUnlocked1 });
            const module2 = createPermissionModule({ eventModule: eventModule2, requireUnlocked: requireUnlocked2 });

            await module1.allowUrlAsync("https://example.com");

            expect(await module1.checkUrlPermissionsAsync("https://example.com")).toBe(true);
            expect(await module2.checkUrlPermissionsAsync("https://example.com")).toBe(false);
        });

        it("should not expose internal Set directly", async () => {
            await permissionModule.allowUrlAsync("https://example.com");

            expect(permissionModule.allowedOriginsSet).toBeUndefined();
            expect(Object.keys(permissionModule)).not.toContain("allowedOriginsSet");
        });
    });

    describe("integration workflow", () => {
        it("should handle add -> check -> revoke lifecycle", async () => {
            const url = "https://example.com/path";

            expect(await permissionModule.checkUrlPermissionsAsync(url)).toBe(false);

            await permissionModule.allowUrlAsync(url);
            expect(await permissionModule.checkUrlPermissionsAsync(url)).toBe(true);

            await permissionModule.revokeUrlAsync(url);
            expect(await permissionModule.checkUrlPermissionsAsync(url)).toBe(false);
        });
    });
});
