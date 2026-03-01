import { describe, it, expect } from "vitest";
import { randomBytes } from "@noble/hashes/utils.js";
import { splitHmacDigest, toUpperHex } from "./Uint8ArrayUtils";

describe("Uint8ArrayUtils", () => {
    describe("splitHmacDigest", () => {
        it("incorrect length", () => {
            const t0 = new Uint8Array(0);
            expect(() => splitHmacDigest(t0)).toThrowError(/expected Uint8Array of length 64/);

            const t63 = new Uint8Array(63);
            expect(() => splitHmacDigest(t63)).toThrowError(/expected Uint8Array of length 64/);

            const t65 = new Uint8Array(65);
            expect(() => splitHmacDigest(t65)).toThrowError(/expected Uint8Array of length 64/);
        });

        it("first/second", () => {
            const p1 = randomBytes(32);
            const p2 = randomBytes(32);
            const t = new Uint8Array([...p1, ...p2]);
            const { first, second } = splitHmacDigest(t);
            expect(first).toEqual(p1);
            expect(second).toEqual(p2);
        });
    });

    describe("toUpperHex", () => {
        it("converts empty array to empty string", () => {
            const arr = new Uint8Array([]);
            expect(toUpperHex(arr)).toBe("");
        });

        it("converts single byte to uppercase hex", () => {
            const arr = new Uint8Array([255]);
            expect(toUpperHex(arr)).toBe("FF");
        });

        it("converts multiple bytes to uppercase hex", () => {
            const arr = new Uint8Array([0, 1, 15, 255]);
            expect(toUpperHex(arr)).toBe("00010FFF");
        });

        it("always returns uppercase", () => {
            const arr = new Uint8Array([171, 205, 239]); // 0xAB, 0xCD, 0xEF
            const result = toUpperHex(arr);
            expect(result).toBe("ABCDEF");
            expect(result).not.toBe("abcdef");
        });

        it("works with random bytes", () => {
            const arr = randomBytes(16);
            const result = toUpperHex(arr);
            expect(result).toHaveLength(32); // 16 bytes * 2 hex chars
            expect(result).toMatch(/^[0-9A-F]+$/);
        });

        it("works with splitHmacDigest results", () => {
            const p1 = randomBytes(32);
            const p2 = randomBytes(32);
            const combined = new Uint8Array([...p1, ...p2]);

            const fullHex = toUpperHex(combined);
            const { first, second } = splitHmacDigest(combined);
            const firstHex = toUpperHex(first);
            const secondHex = toUpperHex(second);

            expect(fullHex).toBe(firstHex + secondHex);
        });
    });
});
