import { describe, it, expect } from "vitest";
import { JSONbigNative, JSONbigNativeString } from "./JSONbigNative.js";

describe("JSONbigNative", () => {
    describe("JSONbigNative (useNativeBigInt: true)", () => {
        it("should parse regular numbers as numbers", () => {
            const json = '{"value": 123}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.value).toBe(123);
            expect(typeof parsed.value).toBe("number");
        });

        it("should parse large numbers as BigInt", () => {
            const json = '{"value": 9007199254740992}'; // MAX_SAFE_INTEGER + 1
            const parsed = JSONbigNative.parse(json);

            expect(parsed.value).toBe(9007199254740992n);
            expect(typeof parsed.value).toBe("bigint");
        });

        it("should stringify BigInt to JSON", () => {
            const obj = { value: 9007199254740992n };
            const stringified = JSONbigNative.stringify(obj);

            expect(stringified).toBe('{"value":9007199254740992}');
        });

        it("should stringify regular numbers", () => {
            const obj = { value: 123 };
            const stringified = JSONbigNative.stringify(obj);

            expect(stringified).toBe('{"value":123}');
        });

        it("should handle nested objects with BigInt", () => {
            const json = '{"nested": {"bigValue": 999999999999999999, "smallValue": 100}}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.nested.bigValue).toBe(999999999999999999n);
            expect(typeof parsed.nested.bigValue).toBe("bigint");
            expect(parsed.nested.smallValue).toBe(100);
            expect(typeof parsed.nested.smallValue).toBe("number");
        });

        it("should handle arrays with BigInt", () => {
            const json = '{"values": [1, 9007199254740992, 100]}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.values[0]).toBe(1);
            expect(parsed.values[1]).toBe(9007199254740992n);
            expect(parsed.values[2]).toBe(100);
        });

        it("should preserve precision for large numbers", () => {
            const json = '{"value": 12345678901234567890}';
            const parsed = JSONbigNative.parse(json);
            const stringified = JSONbigNative.stringify(parsed);

            expect(stringified).toBe('{"value":12345678901234567890}');
        });

        it("should handle negative BigInt", () => {
            const json = '{"value": -9007199254740992}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.value).toBe(-9007199254740992n);
            expect(typeof parsed.value).toBe("bigint");
        });

        it("should handle zero", () => {
            const json = '{"value": 0}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.value).toBe(0);
            expect(typeof parsed.value).toBe("number");
        });

        it("should handle floating point numbers", () => {
            const json = '{"value": 123.456}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.value).toBe(123.456);
            expect(typeof parsed.value).toBe("number");
        });

        it("should handle strings, booleans, and null", () => {
            const json = '{"str": "hello", "bool": true, "nullVal": null}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.str).toBe("hello");
            expect(parsed.bool).toBe(true);
            expect(parsed.nullVal).toBe(null);
        });
    });

    describe("JSONbigNativeString (storeAsString: true)", () => {
        it("should parse regular numbers as numbers", () => {
            const json = '{"value": 123}';
            const parsed = JSONbigNativeString.parse(json);

            expect(parsed.value).toBe(123);
            expect(typeof parsed.value).toBe("number");
        });

        it("should parse large numbers as strings", () => {
            const json = '{"value": 9007199254740992}';
            const parsed = JSONbigNativeString.parse(json);

            expect(parsed.value).toBe("9007199254740992");
            expect(typeof parsed.value).toBe("string");
        });

        it("should stringify BigInt to string in JSON", () => {
            const obj = { value: 9007199254740992n };
            const stringified = JSONbigNativeString.stringify(obj);

            expect(stringified).toBe('{"value":9007199254740992}');
        });

        it("should handle nested objects with string numbers", () => {
            const json = '{"nested": {"bigValue": 999999999999999999, "smallValue": 100}}';
            const parsed = JSONbigNativeString.parse(json);

            expect(parsed.nested.bigValue).toBe("999999999999999999");
            expect(typeof parsed.nested.bigValue).toBe("string");
            expect(parsed.nested.smallValue).toBe(100);
            expect(typeof parsed.nested.smallValue).toBe("number");
        });

        it("should preserve precision for large numbers as strings", () => {
            const json = '{"value": 12345678901234567890}';
            const parsed = JSONbigNativeString.parse(json);

            expect(parsed.value).toBe("12345678901234567890");
            expect(typeof parsed.value).toBe("string");
        });

        it("should handle negative large numbers as strings", () => {
            const json = '{"value": -9007199254740992}';
            const parsed = JSONbigNativeString.parse(json);

            expect(parsed.value).toBe("-9007199254740992");
            expect(typeof parsed.value).toBe("string");
        });

        it("should stringify string numbers correctly", () => {
            const obj = { value: "9007199254740992" };
            const stringified = JSONbigNativeString.stringify(obj);

            expect(stringified).toBe('{"value":"9007199254740992"}');
        });
    });

    describe("Round-trip conversion", () => {
        it("should round-trip with JSONbigNative", () => {
            const original = {
                small: 123,
                large: 9007199254740992n,
                str: "test",
                bool: true,
            };

            const stringified = JSONbigNative.stringify(original);
            const parsed = JSONbigNative.parse(stringified);

            expect(parsed.small).toBe(123);
            expect(parsed.large).toBe(9007199254740992n);
            expect(parsed.str).toBe("test");
            expect(parsed.bool).toBe(true);
        });

        it("should maintain precision through round-trip", () => {
            const original = { value: 12345678901234567890n };
            const stringified = JSONbigNative.stringify(original);
            const parsed = JSONbigNative.parse(stringified);
            const stringifiedAgain = JSONbigNative.stringify(parsed);

            expect(stringified).toBe(stringifiedAgain);
        });
    });

    describe("Edge cases", () => {
        it("should handle empty object", () => {
            const json = "{}";
            const parsed = JSONbigNative.parse(json);

            expect(parsed).toEqual({});
        });

        it("should handle empty array", () => {
            const json = "[]";
            const parsed = JSONbigNative.parse(json);

            expect(parsed).toEqual([]);
        });

        it("should handle MAX_SAFE_INTEGER boundary", () => {
            const json = `{"value": ${Number.MAX_SAFE_INTEGER}}`;
            const parsed = JSONbigNative.parse(json);

            // json-bigint may parse MAX_SAFE_INTEGER as BigInt depending on implementation
            expect([Number.MAX_SAFE_INTEGER, BigInt(Number.MAX_SAFE_INTEGER)]).toContainEqual(parsed.value);
        });

        it("should handle MAX_SAFE_INTEGER + 1 as BigInt", () => {
            const json = `{"value": ${Number.MAX_SAFE_INTEGER + 1}}`;
            const parsed = JSONbigNative.parse(json);

            expect(typeof parsed.value).toBe("bigint");
        });

        it("should handle deeply nested structures", () => {
            const json = '{"a":{"b":{"c":{"d":9007199254740992}}}}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.a.b.c.d).toBe(9007199254740992n);
        });

        it("should handle mixed arrays", () => {
            const json = '{"arr": [1, "two", true, null, 9007199254740992]}';
            const parsed = JSONbigNative.parse(json);

            expect(parsed.arr[0]).toBe(1);
            expect(parsed.arr[1]).toBe("two");
            expect(parsed.arr[2]).toBe(true);
            expect(parsed.arr[3]).toBe(null);
            expect(parsed.arr[4]).toBe(9007199254740992n);
        });
    });
});
