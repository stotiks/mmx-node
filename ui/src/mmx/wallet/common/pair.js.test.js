import { describe, it, expect } from "vitest";
import { pair } from "./pair.js";

describe("pair", () => {
    describe("constructor", () => {
        it("should create pair with primitive values", () => {
            const p = new pair("key", "value");
            expect(p.key).toBe("key");
            expect(p.value).toBe("value");
        });

        it("should create pair with number values", () => {
            const p = new pair(1, 2);
            expect(p.key).toBe(1);
            expect(p.value).toBe(2);
        });

        it("should create pair with mixed types", () => {
            const p = new pair("key", 123);
            expect(p.key).toBe("key");
            expect(p.value).toBe(123);
        });

        it("should create pair with BigInt", () => {
            const p = new pair(100n, 200n);
            expect(p.key).toBe(100n);
            expect(p.value).toBe(200n);
        });

        it("should create pair with objects", () => {
            const keyObj = { id: 1 };
            const valueObj = { data: "test" };
            const p = new pair(keyObj, valueObj);

            expect(p.key).toBe(keyObj);
            expect(p.value).toBe(valueObj);
        });

        it("should create pair with arrays", () => {
            const keyArr = [1, 2, 3];
            const valueArr = ["a", "b", "c"];
            const p = new pair(keyArr, valueArr);

            expect(p.key).toBe(keyArr);
            expect(p.value).toBe(valueArr);
        });

        it("should handle undefined key and value", () => {
            const p = new pair(undefined, undefined);
            expect(p.key).toBeUndefined();
            expect(p.value).toBeUndefined();
        });

        it("should handle null key and value", () => {
            const p = new pair(null, null);
            expect(p.key).toBe(null);
            expect(p.value).toBe(null);
        });

        it("should handle empty strings", () => {
            const p = new pair("", "");
            expect(p.key).toBe("");
            expect(p.value).toBe("");
        });

        it("should handle boolean values", () => {
            const p = new pair(true, false);
            expect(p.key).toBe(true);
            expect(p.value).toBe(false);
        });
    });

    describe("getters", () => {
        it("should return key via getter", () => {
            const p = new pair("myKey", "myValue");
            expect(p.key).toBe("myKey");
        });

        it("should return value via getter", () => {
            const p = new pair("myKey", "myValue");
            expect(p.value).toBe("myValue");
        });

        it("should have read-only key property", () => {
            const p = new pair("originalKey", "value");

            // Attempting to set should throw (readonly getter)
            expect(() => {
                p.key = "newKey";
            }).toThrow();
        });

        it("should have read-only value property", () => {
            const p = new pair("key", "originalValue");

            // Attempting to set should throw (readonly getter)
            expect(() => {
                p.value = "newValue";
            }).toThrow();
        });
    });

    describe("immutability", () => {
        it("should store objects by reference", () => {
            const obj = { data: "test" };
            const p = new pair("key", obj);

            expect(p.value).toBe(obj);
        });

        it("should allow object mutation through reference", () => {
            const obj = { data: "test" };
            const p = new pair("key", obj);

            obj.data = "modified";
            expect(p.value.data).toBe("modified");
        });

        it("should not allow reassignment of key", () => {
            const p = new pair("originalKey", "value");

            expect(() => {
                p.key = "newKey";
            }).toThrow();

            expect(p.key).toBe("originalKey");
        });

        it("should not allow reassignment of value", () => {
            const p = new pair("key", "originalValue");

            expect(() => {
                p.value = "newValue";
            }).toThrow();

            expect(p.value).toBe("originalValue");
        });
    });

    describe("edge cases", () => {
        it("should handle Functions as key or value", () => {
            const keyFn = () => "key";
            const valueFn = () => "value";
            const p = new pair(keyFn, valueFn);

            expect(p.key).toBe(keyFn);
            expect(p.value).toBe(valueFn);
            expect(p.key()).toBe("key");
            expect(p.value()).toBe("value");
        });

        it("should handle Dates", () => {
            const keyDate = new Date("2025-01-01");
            const valueDate = new Date("2025-12-31");
            const p = new pair(keyDate, valueDate);

            expect(p.key).toBe(keyDate);
            expect(p.value).toBe(valueDate);
        });

        it("should handle Map objects", () => {
            const keyMap = new Map([["a", 1]]);
            const valueMap = new Map([["b", 2]]);
            const p = new pair(keyMap, valueMap);

            expect(p.key).toBe(keyMap);
            expect(p.value).toBe(valueMap);
        });

        it("should handle Set objects", () => {
            const keySet = new Set([1, 2, 3]);
            const valueSet = new Set([4, 5, 6]);
            const p = new pair(keySet, valueSet);

            expect(p.key).toBe(keySet);
            expect(p.value).toBe(valueSet);
        });

        it("should handle Uint8Array", () => {
            const keyArr = new Uint8Array([1, 2, 3]);
            const valueArr = new Uint8Array([4, 5, 6]);
            const p = new pair(keyArr, valueArr);

            expect(p.key).toBe(keyArr);
            expect(p.value).toBe(valueArr);
        });

        it("should handle Symbol as key or value", () => {
            const keySymbol = Symbol("key");
            const valueSymbol = Symbol("value");
            const p = new pair(keySymbol, valueSymbol);

            expect(p.key).toBe(keySymbol);
            expect(p.value).toBe(valueSymbol);
        });

        it("should handle nested pairs", () => {
            const innerPair = new pair("innerKey", "innerValue");
            const outerPair = new pair("outerKey", innerPair);

            expect(outerPair.key).toBe("outerKey");
            expect(outerPair.value).toBe(innerPair);
            expect(outerPair.value.key).toBe("innerKey");
            expect(outerPair.value.value).toBe("innerValue");
        });

        it("should handle NaN", () => {
            const p = new pair(NaN, NaN);
            expect(p.key).toBeNaN();
            expect(p.value).toBeNaN();
        });

        it("should handle Infinity", () => {
            const p = new pair(Infinity, -Infinity);
            expect(p.key).toBe(Infinity);
            expect(p.value).toBe(-Infinity);
        });

        it("should handle zero and negative zero", () => {
            const p = new pair(0, -0);
            expect(p.key).toBe(0);
            expect(p.value).toBe(-0);
        });
    });

    describe("type preservation", () => {
        it("should preserve string types", () => {
            const p = new pair("key", "value");
            expect(typeof p.key).toBe("string");
            expect(typeof p.value).toBe("string");
        });

        it("should preserve number types", () => {
            const p = new pair(1, 2);
            expect(typeof p.key).toBe("number");
            expect(typeof p.value).toBe("number");
        });

        it("should preserve BigInt types", () => {
            const p = new pair(100n, 200n);
            expect(typeof p.key).toBe("bigint");
            expect(typeof p.value).toBe("bigint");
        });

        it("should preserve boolean types", () => {
            const p = new pair(true, false);
            expect(typeof p.key).toBe("boolean");
            expect(typeof p.value).toBe("boolean");
        });

        it("should preserve object types", () => {
            const p = new pair({}, {});
            expect(typeof p.key).toBe("object");
            expect(typeof p.value).toBe("object");
        });

        it("should preserve array types", () => {
            const p = new pair([], []);
            expect(Array.isArray(p.key)).toBe(true);
            expect(Array.isArray(p.value)).toBe(true);
        });

        it("should preserve undefined types", () => {
            const p = new pair(undefined, undefined);
            expect(typeof p.key).toBe("undefined");
            expect(typeof p.value).toBe("undefined");
        });
    });

    describe("use cases", () => {
        it("should work as key-value store", () => {
            const p = new pair("username", "john_doe");
            expect(p.key).toBe("username");
            expect(p.value).toBe("john_doe");
        });

        it("should work for coordinate pairs", () => {
            const p = new pair(10, 20);
            expect(p.key).toBe(10); // x coordinate
            expect(p.value).toBe(20); // y coordinate
        });

        it("should work for labeled data", () => {
            const p = new pair("temperature", 25.5);
            expect(p.key).toBe("temperature");
            expect(p.value).toBe(25.5);
        });

        it("should work in array of pairs", () => {
            const pairs = [new pair("a", 1), new pair("b", 2), new pair("c", 3)];

            expect(pairs[0].key).toBe("a");
            expect(pairs[0].value).toBe(1);
            expect(pairs[1].key).toBe("b");
            expect(pairs[1].value).toBe(2);
            expect(pairs[2].key).toBe("c");
            expect(pairs[2].value).toBe(3);
        });

        it("should work for Map-like structures", () => {
            const pairArray = [new pair("name", "Alice"), new pair("age", 30), new pair("city", "NYC")];

            const found = pairArray.find((p) => p.key === "age");
            expect(found?.value).toBe(30);
        });
    });
});
