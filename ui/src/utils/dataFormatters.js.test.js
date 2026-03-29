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

        it("should use custom indent parameter", () => {
            const obj = { test: "value" };
            const result = stringify(obj, 2);
            expect(result).toContain('{\n  "test": "value"\n}');
        });

        it("should use zero indent", () => {
            const obj = { test: "value" };
            const result = stringify(obj, 0);
            expect(result).toBe('{"test":"value"}');
        });

        it("should handle arrays", () => {
            const arr = [1, 2, 3];
            const result = stringify(arr);
            expect(result).toContain("[\n    1,\n    2,\n    3\n]");
        });

        it("should handle nested objects", () => {
            const obj = { a: { b: { c: "d" } } };
            const result = stringify(obj);
            expect(result).toContain('"a":');
            expect(result).toContain('"b":');
            expect(result).toContain('"c": "d"');
        });

        it("should handle objects with toJSON method", () => {
            const obj = {
                test: "value",
                toJSON() {
                    return { custom: "json" };
                },
            };
            const result = stringify(obj);
            expect(result).toContain('"custom": "json"');
        });

        it("should handle bigint in objects gracefully", () => {
            const obj = { big: BigInt(123) };
            const result = stringify(obj);
            expect(typeof result).toBe("string");
        });

        it("should handle functions in objects", () => {
            const obj = {
                test: "value",
                fn: () => {},
            };
            const result = stringify(obj);
            expect(result).toContain('"test": "value"');
        });

        it("should handle undefined in objects", () => {
            const obj = {
                test: "value",
                undef: undefined,
            };
            const result = stringify(obj);
            expect(result).not.toContain("undef");
        });

        it("should handle dates", () => {
            const obj = { date: new Date("2024-01-01T00:00:00.000Z") };
            const result = stringify(obj);
            expect(result).toContain("2024-01-01T00:00:00.000Z");
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

        it("should reject addresses with wrong length", () => {
            expect(isMMXAddress("mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scy")).toBe(false);
            expect(isMMXAddress("mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm00")).toBe(false);
        });

        it("should reject addresses without mmx1 prefix", () => {
            expect(isMMXAddress("xxx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm")).toBe(false);
            expect(isMMXAddress("1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm")).toBe(false);
        });

        it("should reject non-string types", () => {
            expect(isMMXAddress({})).toBe(false);
            expect(isMMXAddress([])).toBe(false);
            expect(isMMXAddress(true)).toBe(false);
            expect(isMMXAddress(undefined)).toBe(false);
        });
    });

    describe("isHexString", () => {
        it("should validate hex strings", () => {
            const validHex = "a".repeat(68);
            expect(isHexString(validHex)).toBe(true);

            const longerHex = "a1b2c3d4".repeat(20);
            expect(isHexString(longerHex)).toBe(true);
        });

        it("should reject invalid hex strings", () => {
            expect(isHexString("short")).toBe(false);
            expect(isHexString("g".repeat(68))).toBe(false);
            expect(isHexString("a".repeat(67))).toBe(false);
            expect(isHexString(null)).toBe(false);
            expect(isHexString("")).toBe(false);
        });

        it("should use custom minLength parameter", () => {
            expect(isHexString("abcd", 4)).toBe(true);
            expect(isHexString("abcd", 10)).toBe(false);
            expect(isHexString("a".repeat(100), 50)).toBe(true);
        });

        it("should accept uppercase hex characters", () => {
            expect(isHexString("ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234ABCD1234")).toBe(true);
        });

        it("should accept mixed case hex characters", () => {
            expect(isHexString("aBcD1234aBcD1234aBcD1234aBcD1234aBcD1234aBcD1234aBcD1234aBcD1234aBcD1234")).toBe(true);
        });

        it("should reject strings with non-hex characters", () => {
            expect(isHexString("xyz1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234")).toBe(false);
            expect(isHexString("12345 6789abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456")).toBe(false);
        });

        it("should reject non-string types", () => {
            expect(isHexString(123)).toBe(false);
            expect(isHexString({})).toBe(false);
            expect(isHexString([])).toBe(false);
            expect(isHexString(true)).toBe(false);
            expect(isHexString(undefined)).toBe(false);
        });
    });

    describe("isExpandable", () => {
        it("should return true for objects with content", () => {
            expect(isExpandable({ key: "value" }, "test")).toBe(true);
        });

        it("should return true for source key", () => {
            expect(isExpandable("any value", "source")).toBe(true);
            expect(isExpandable(null, "source")).toBe(true);
            expect(isExpandable(undefined, "source")).toBe(true);
            expect(isExpandable(123, "source")).toBe(true);
        });

        it("should return true for hex strings", () => {
            const hexString = "a".repeat(68);
            expect(isExpandable(hexString, "data")).toBe(true);
        });

        it("should return false for non-expandable values", () => {
            expect(isExpandable("string", "key")).toBe(false);
            expect(isExpandable(123, "key")).toBe(false);
            expect(isExpandable({}, "key")).toBe(false);
        });

        it("should return false for empty strings", () => {
            expect(isExpandable("", "key")).toBe(false);
        });

        it("should return false for short strings", () => {
            expect(isExpandable("short", "key")).toBe(false);
        });

        it("should return true for arrays with content", () => {
            expect(isExpandable([1, 2, 3], "key")).toBe(true);
        });

        it("should return false for empty arrays", () => {
            expect(isExpandable([], "key")).toBe(false);
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

        it("should format strings correctly", () => {
            const str = "this is a test string";
            const result = formatObjectForDisplay(str);
            expect(result.type).toBe("string");
            expect(result.displayValue).toBe(str);
            expect(result.isExpandable).toBe(false);
            expect(result.isClickable).toBe(false);
        });

        it("should format objects correctly", () => {
            const obj = { key: "value" };
            const result = formatObjectForDisplay(obj);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(true);
            expect(result.displayValue).toContain("key");
        });

        it("should handle empty objects", () => {
            const obj = {};
            const result = formatObjectForDisplay(obj);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(false);
            expect(result.displayValue).toBe("{}");
        });

        it("should handle null values", () => {
            const result = formatObjectForDisplay(null);
            expect(result.type).toBe("null");
            expect(result.displayValue).toBe("null");
        });

        it("should handle undefined values", () => {
            const result = formatObjectForDisplay(undefined);
            expect(result.type).toBe("null");
            expect(result.displayValue).toBe("null");
        });

        it("should format numbers correctly", () => {
            const result = formatObjectForDisplay(123);
            expect(result.type).toBe("number");
            expect(result.displayValue).toBe("123");
            expect(result.isExpandable).toBe(false);
            expect(result.isClickable).toBe(false);
        });

        it("should format zero correctly", () => {
            const result = formatObjectForDisplay(0);
            expect(result.type).toBe("number");
            expect(result.displayValue).toBe("0");
        });

        it("should format negative numbers correctly", () => {
            const result = formatObjectForDisplay(-42);
            expect(result.type).toBe("number");
            expect(result.displayValue).toBe("-42");
        });

        it("should format floats correctly", () => {
            const result = formatObjectForDisplay(3.14159);
            expect(result.type).toBe("number");
            expect(result.displayValue).toBe("3.14159");
        });

        it("should format booleans correctly", () => {
            const resultTrue = formatObjectForDisplay(true);
            expect(resultTrue.type).toBe("boolean");
            expect(resultTrue.displayValue).toBe("true");
            expect(resultTrue.isExpandable).toBe(false);
            expect(resultTrue.isClickable).toBe(false);

            const resultFalse = formatObjectForDisplay(false);
            expect(resultFalse.type).toBe("boolean");
            expect(resultFalse.displayValue).toBe("false");
        });

        it("should handle unknown types", () => {
            const symbol = Symbol("test");
            const result = formatObjectForDisplay(symbol);
            expect(result.type).toBe("unknown");
            expect(result.displayValue).toBe("Symbol(test)");
        });

        it("should handle arrays", () => {
            const arr = [1, 2, 3];
            const result = formatObjectForDisplay(arr);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(true);
        });

        it("should handle empty arrays", () => {
            const arr = [];
            const result = formatObjectForDisplay(arr);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(false);
        });

        it("should handle nested objects", () => {
            const obj = { a: { b: { c: "d" } } };
            const result = formatObjectForDisplay(obj);
            expect(result.type).toBe("object");
            expect(result.isExpandable).toBe(true);
        });

        it("should include value in result", () => {
            const value = { test: "data" };
            const result = formatObjectForDisplay(value);
            expect(result.value).toBe(value);
        });

        it("should handle functions", () => {
            const fn = () => "test";
            const result = formatObjectForDisplay(fn);
            expect(result.type).toBe("unknown");
        });
    });
});
