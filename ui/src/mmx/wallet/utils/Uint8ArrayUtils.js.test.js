import { describe, it, expect } from "vitest";
import { randomBytes } from "@noble/hashes/utils.js";
import "./Uint8ArrayUtils";

describe("Uint8ArrayUtils", () => {
    describe("first/second properties", () => {
        it("incorrect length", () => {
            const t0 = new Uint8Array(0);
            expect(() => t0.first).toThrowError("expected Uint8Array of length 64");
            expect(() => t0.second).toThrowError("expected Uint8Array of length 64");

            const t63 = new Uint8Array(63);
            expect(() => t63.first).toThrowError("expected Uint8Array of length 64");
            expect(() => t63.second).toThrowError("expected Uint8Array of length 64");

            const t65 = new Uint8Array(65);
            expect(() => t65.first).toThrowError("expected Uint8Array of length 64");
            expect(() => t65.second).toThrowError("expected Uint8Array of length 64");
        });

        it("first/second", () => {
            const p1 = randomBytes(32);
            const p2 = randomBytes(32);
            const t = new Uint8Array([...p1, ...p2]);
            expect(t.first).toEqual(p1);
            expect(t.second).toEqual(p2);
        });
    });

    describe("toHex method", () => {
        it("converts empty array to empty string", () => {
            const arr = new Uint8Array([]);
            expect(arr.toHex()).toBe("");
        });

        it("converts single byte to uppercase hex", () => {
            const arr = new Uint8Array([255]);
            expect(arr.toHex()).toBe("FF");
        });

        it("converts multiple bytes to uppercase hex", () => {
            const arr = new Uint8Array([0, 1, 15, 255]);
            expect(arr.toHex()).toBe("00010FFF");
        });

        it("always returns uppercase", () => {
            const arr = new Uint8Array([171, 205, 239]); // 0xAB, 0xCD, 0xEF
            const result = arr.toHex();
            expect(result).toBe("ABCDEF");
            expect(result).not.toBe("abcdef");
        });

        it("works with random bytes", () => {
            const arr = randomBytes(16);
            const result = arr.toHex();
            expect(result).toHaveLength(32); // 16 bytes * 2 hex chars
            expect(result).toMatch(/^[0-9A-F]+$/);
        });

        it("works with first/second properties", () => {
            const p1 = randomBytes(32);
            const p2 = randomBytes(32);
            const combined = new Uint8Array([...p1, ...p2]);

            const fullHex = combined.toHex();
            const firstHex = combined.first.toHex();
            const secondHex = combined.second.toHex();

            expect(fullHex).toBe(firstHex + secondHex);
        });
    });
});
