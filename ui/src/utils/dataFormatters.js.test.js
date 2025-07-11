import { describe, it, expect } from "vitest";
import { stringify, isMMXAddress, isHexString, isExpandable, formatObjectForDisplay } from "./dataFormatters";

describe("dataFormatters", () => {
    describe("stringify", () => {
        it("should stringify objects with proper indentation", () => {
            const obj = { test: "value", nested: { key: "value" } };
            const result = stringify(obj);
            expect(result).toContain('{\n    "test": "value"');
        });

        it("should return string representation for non-objects", () => {
            expect(stringify("test")).toBe("test");
            expect(stringify(123)).toBe("123");
            expect(stringify(null)).toBe("null");
        });

        it("should handle circular references gracefully", () => {
            const obj = { test: "value" };
            obj.circular = obj;
            const result = stringify(obj);
            expect(typeof result).toBe("string");
        });
    });

    describe("isMMXAddress", () => {
        it("should validate correct MMX addresses", () => {
            const validAddress = "mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm";
            expect(isMMXAddress(validAddress)).toBe(true);
        });

        it("should reject invalid addresses", () => {
            expect(isMMXAddress("invalid")).toBe(false);
            expect(isMMXAddress("mmx1short")).toBe(false);
            expect(isMMXAddress("btc1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm")).toBe(false);
            expect(isMMXAddress(null)).toBe(false);
            expect(isMMXAddress(123)).toBe(false);
        });
    });

    describe("isHexString", () => {
        it("should validate hex strings", () => {
            const validHex = "a".repeat(68); // 68 character hex string
            expect(isHexString(validHex)).toBe(true);

            const longerHex = "a1b2c3d4".repeat(20); // 160 character hex string
            expect(isHexString(longerHex)).toBe(true);
        });

        it("should reject invalid hex strings", () => {
            expect(isHexString("short")).toBe(false);
            expect(isHexString("g".repeat(68))).toBe(false); // invalid hex character
            expect(isHexString("a".repeat(67))).toBe(false); // odd length
            expect(isHexString(null)).toBe(false);
            expect(isHexString("")).toBe(false);
        });
    });

    describe("isExpandable", () => {
        it("should return true for objects with content", () => {
            expect(isExpandable({ key: "value" }, "test")).toBe(true);
        });

        it("should return true for source key", () => {
            expect(isExpandable("any value", "source")).toBe(true);
        });

        it("should return true for hex strings", () => {
            const hexString = "a".repeat(68);
            expect(isExpandable(hexString, "data")).toBe(true);
        });

        it("should return false for non-expandable values", () => {
            expect(isExpandable("string", "key")).toBe(false);
            expect(isExpandable(123, "key")).toBe(false);
            expect(isExpandable({}, "key")).toBe(false); // empty object
        });
    });

    describe("formatObjectForDisplay", () => {
        it("should format MMX addresses correctly", () => {
            const address = "mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm";
            const result = formatObjectForDisplay(address);
            expect(result.type).toBe("address");
            expect(result.isClickable).toBe(true);
            expect(result.isExpandable).toBe(false);
        });

        it("should format hex strings correctly", () => {
            const hexString = "a".repeat(68);
            const result = formatObjectForDisplay(hexString);
            expect(result.type).toBe("hex");
            expect(result.isExpandable).toBe(true);
            expect(result.isClickable).toBe(false);
        });

        it("should format objects correctly", () => {
            const obj = { key: "value" };
            const result = formatObjectForDisplay(obj);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(true);
            expect(result.displayValue).toContain("key");
        });

        it("should handle null values", () => {
            const result = formatObjectForDisplay(null);
            expect(result.type).toBe("null");
            expect(result.displayValue).toBe("null");
        });
    });
});
