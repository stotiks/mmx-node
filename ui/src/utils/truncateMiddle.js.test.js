import { describe, it, expect } from "vitest";
import { truncateMiddle, getShortAddr, getShortHash } from "./truncateMiddle";

describe("truncateMiddle", () => {
    it("should truncate string in the middle with default params", () => {
        const str = "abcdefghijklmnopqrstuvwxyz";
        const result = truncateMiddle(str);
        expect(result).toBe("abcdefghij...qrstuvwxyz");
    });

    it("should use custom frontChars and endChars", () => {
        const str = "abcdefghijklmnopqrstuvwxyz";
        const result = truncateMiddle(str, 5, 5);
        expect(result).toBe("abcde...vwxyz");
    });

    it("should return original string if shorter than frontChars + endChars", () => {
        const str = "short";
        const result = truncateMiddle(str, 10, 10);
        expect(result).toBe("short");
    });

    it("should return original string if length equals frontChars + endChars", () => {
        const str = "abcdefghij";
        const result = truncateMiddle(str, 5, 5);
        expect(result).toBe("abcdefghij");
    });

    it("should truncate when length is exactly frontChars + endChars + 1", () => {
        const str = "abcdefghijk";
        const result = truncateMiddle(str, 5, 5);
        expect(result).toBe("abcde...ghijk");
    });

    it("should handle empty string", () => {
        expect(truncateMiddle("")).toBe("");
    });

    it("should handle null", () => {
        expect(truncateMiddle(null)).toBeNull();
    });

    it("should handle undefined", () => {
        expect(truncateMiddle(undefined)).toBeUndefined();
    });

    it("should handle single character string", () => {
        expect(truncateMiddle("a")).toBe("a");
    });

    it("should handle whitespace string", () => {
        expect(truncateMiddle("   ")).toBe("   ");
    });

    it("should handle string with length equal to frontChars only", () => {
        const str = "abcde";
        const result = truncateMiddle(str, 5, 5);
        expect(result).toBe("abcde");
    });

    it("should handle string with length equal to endChars only", () => {
        const str = "vwxyz";
        const result = truncateMiddle(str, 5, 5);
        expect(result).toBe("vwxyz");
    });

    it("should handle different frontChars and endChars values", () => {
        const str = "abcdefghijklmnopqrstuvwxyz";
        const result = truncateMiddle(str, 3, 7);
        expect(result).toBe("abc...tuvwxyz");
    });

    it("should handle very large frontChars value", () => {
        const str = "test";
        const result = truncateMiddle(str, 100, 5);
        expect(result).toBe("test");
    });

    it("should handle very large endChars value", () => {
        const str = "test";
        const result = truncateMiddle(str, 5, 100);
        expect(result).toBe("test");
    });

    it("should handle zero frontChars", () => {
        const str = "abcdefghij";
        const result = truncateMiddle(str, 0, 5);
        expect(result).toBe("...fghij");
    });

    it("should handle zero endChars", () => {
        const str = "abcdefghij";
        const result = truncateMiddle(str, 5, 0);
        expect(result).toBe("abcde...");
    });

    it("should handle both zero frontChars and endChars", () => {
        const str = "abcdefghij";
        const result = truncateMiddle(str, 0, 0);
        expect(result).toBe("...");
    });

    it("should preserve special characters", () => {
        const str = "mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm";
        const result = truncateMiddle(str, 6, 6);
        expect(result).toContain("...");
        expect(result.startsWith("mmx1cd")).toBe(true);
        expect(result.endsWith("vq6scyfm")).toBe(false);
        expect(result.endsWith("6scyfm")).toBe(true);
    });

    it("should handle unicode characters", () => {
        const str = "你好世界 Hello World";
        const result = truncateMiddle(str, 3, 3);
        expect(result).toContain("...");
    });

    it("should handle strings with only ellipsis length", () => {
        const str = "...";
        const result = truncateMiddle(str, 10, 10);
        expect(result).toBe("...");
    });

    it("should handle emoji characters", () => {
        const str = "😀😁😂😃😄😅😆😇😈😉😊😋";
        const result = truncateMiddle(str, 3, 3);
        expect(result).toContain("...");
    });
});

describe("getShortAddr", () => {
    const longAddress = "mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm";

    it("should truncate address with default length", () => {
        const result = getShortAddr(longAddress);
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(longAddress.length);
    });

    it("should use custom length parameter", () => {
        const result = getShortAddr(longAddress, 6);
        const parts = result.split("...");
        expect(parts[0].length).toBe(6);
        expect(parts[1].length).toBe(6);
    });

    it("should return full string if length is greater than half the string length", () => {
        const shortAddr = "mmx1short";
        const result = getShortAddr(shortAddr, 10);
        expect(result).toBe(shortAddr);
    });

    it("should handle empty string", () => {
        const result = getShortAddr("");
        expect(result).toBe("");
    });

    it("should handle null or undefined", () => {
        expect(getShortAddr(null)).toBeNull();
        expect(getShortAddr(undefined)).toBeUndefined();
    });

    it("should preserve address format with default length", () => {
        const result = getShortAddr(longAddress);
        expect(result).toMatch(/^mmx1\w+\.\.\.\w+$/);
    });

    it("should work with different length values", () => {
        expect(getShortAddr(longAddress, 4)).toMatch(/^\w{4}\.\.\.\w{4}$/);
        expect(getShortAddr(longAddress, 8)).toMatch(/^\w{8}\.\.\.\w{8}$/);
        expect(getShortAddr(longAddress, 12)).toMatch(/^\w{12}\.\.\.\w{12}$/);
    });

    it("should handle zero length", () => {
        const result = getShortAddr(longAddress, 0);
        expect(result).toBe("...");
    });

    it("should handle length of 1", () => {
        const result = getShortAddr(longAddress, 1);
        expect(result).toMatch(/^\w\.\.\.\w$/);
    });

    it("should handle very large length", () => {
        const result = getShortAddr(longAddress, 100);
        expect(result).toBe(longAddress);
    });
});

describe("getShortHash", () => {
    const longHash = "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456";

    it("should truncate hash with default length", () => {
        const result = getShortHash(longHash);
        expect(result).toContain("...");
        expect(result.length).toBeLessThan(longHash.length);
    });

    it("should use custom length parameter", () => {
        const result = getShortHash(longHash, 6);
        const parts = result.split("...");
        expect(parts[0].length).toBe(6);
        expect(parts[1].length).toBe(6);
    });

    it("should return full string if length is greater than half the string length", () => {
        const shortHash = "a1b2c3d4";
        const result = getShortHash(shortHash, 10);
        expect(result).toBe(shortHash);
    });

    it("should handle empty string", () => {
        const result = getShortHash("");
        expect(result).toBe("");
    });

    it("should handle null or undefined", () => {
        expect(getShortHash(null)).toBeNull();
        expect(getShortHash(undefined)).toBeUndefined();
    });

    it("should preserve hash format with default length", () => {
        const result = getShortHash(longHash);
        expect(result).toMatch(/^[a-f0-9]+\.\.\.[a-f0-9]+$/i);
    });

    it("should work with different length values", () => {
        expect(getShortHash(longHash, 4)).toMatch(/^\w{4}\.\.\.\w{4}$/);
        expect(getShortHash(longHash, 8)).toMatch(/^\w{8}\.\.\.\w{8}$/);
        expect(getShortHash(longHash, 12)).toMatch(/^\w{12}\.\.\.\w{12}$/);
    });

    it("should produce same output for same input", () => {
        const hash = "abc123def456789012345678901234567890abcdef1234567890abcdef123456";
        const result1 = getShortHash(hash);
        const result2 = getShortHash(hash);
        expect(result1).toBe(result2);
    });

    it("should handle zero length", () => {
        const result = getShortHash(longHash, 0);
        expect(result).toBe("...");
    });

    it("should handle length of 1", () => {
        const result = getShortHash(longHash, 1);
        expect(result).toMatch(/^\w\.\.\.\w$/);
    });

    it("should handle very large length", () => {
        const result = getShortHash(longHash, 100);
        expect(result).toBe(longHash);
    });

    it("should handle uppercase hex hash", () => {
        const hash = "A1B2C3D4E5F6789012345678901234567890ABCDEF1234567890ABCDEF123456";
        const result = getShortHash(hash, 4);
        expect(result).toMatch(/^[A-F0-9]{4}\.\.\.[A-F0-9]{4}$/);
    });
});
