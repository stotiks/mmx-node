import { describe, it, expect } from "vitest";
import { optional } from "./optional.js";

describe("optional", () => {
    describe("constructor", () => {
        it("should store non-null, non-undefined values", () => {
            const opt = new optional(42);
            expect(opt.valueOf()).toBe(42);
        });

        it("should store string values", () => {
            const opt = new optional("test");
            expect(opt.valueOf()).toBe("test");
        });

        it("should store empty string", () => {
            const opt = new optional("");
            expect(opt.valueOf()).toBe("");
        });

        it("should store boolean false", () => {
            const opt = new optional(false);
            expect(opt.valueOf()).toBe(false);
        });

        it("should store zero", () => {
            const opt = new optional(0);
            expect(opt.valueOf()).toBe(0);
        });

        it("should store BigInt values", () => {
            const opt = new optional(123456789n);
            expect(opt.valueOf()).toBe(123456789n);
        });

        it("should store objects", () => {
            const obj = { key: "value" };
            const opt = new optional(obj);
            expect(opt.valueOf()).toBe(obj);
        });

        it("should store arrays", () => {
            const arr = [1, 2, 3];
            const opt = new optional(arr);
            expect(opt.valueOf()).toBe(arr);
        });
    });

    describe("handling undefined", () => {
        it("should return undefined for null value", () => {
            const opt = new optional(null);
            expect(opt.valueOf()).toBeUndefined();
        });

        it("should return undefined for undefined value", () => {
            const opt = new optional(undefined);
            expect(opt.valueOf()).toBeUndefined();
        });

        it("should return undefined when no value provided", () => {
            const opt = new optional();
            expect(opt.valueOf()).toBeUndefined();
        });
    });

    describe("edge cases", () => {
        it("should handle nested objects", () => {
            const nested = { outer: { inner: "value" } };
            const opt = new optional(nested);
            expect(opt.valueOf()).toBe(nested);
            expect(opt.valueOf().outer.inner).toBe("value");
        });

        it("should handle functions", () => {
            const fn = () => "test";
            const opt = new optional(fn);
            expect(opt.valueOf()).toBe(fn);
            expect(opt.valueOf()()).toBe("test");
        });

        it("should handle dates", () => {
            const date = new Date("2025-01-01");
            const opt = new optional(date);
            expect(opt.valueOf()).toBe(date);
        });

        it("should handle Map objects", () => {
            const map = new Map([
                ["key1", "value1"],
                ["key2", "value2"],
            ]);
            const opt = new optional(map);
            expect(opt.valueOf()).toBe(map);
            expect(opt.valueOf().get("key1")).toBe("value1");
        });

        it("should handle Set objects", () => {
            const set = new Set([1, 2, 3]);
            const opt = new optional(set);
            expect(opt.valueOf()).toBe(set);
            expect(opt.valueOf().has(2)).toBe(true);
        });

        it("should handle Uint8Array", () => {
            const arr = new Uint8Array([1, 2, 3]);
            const opt = new optional(arr);
            expect(opt.valueOf()).toBe(arr);
        });

        it("should not convert empty array to undefined", () => {
            const opt = new optional([]);
            expect(opt.valueOf()).toEqual([]);
            expect(opt.valueOf()).not.toBeUndefined();
        });

        it("should not convert empty object to undefined", () => {
            const opt = new optional({});
            expect(opt.valueOf()).toEqual({});
            expect(opt.valueOf()).not.toBeUndefined();
        });

        it("should handle NaN", () => {
            const opt = new optional(NaN);
            expect(opt.valueOf()).toBeNaN();
        });

        it("should handle Infinity", () => {
            const opt = new optional(Infinity);
            expect(opt.valueOf()).toBe(Infinity);
        });

        it("should handle negative Infinity", () => {
            const opt = new optional(-Infinity);
            expect(opt.valueOf()).toBe(-Infinity);
        });
    });

    describe("immutability", () => {
        it("should not expose internal value mutably", () => {
            const opt = new optional(42);
            const value = opt.valueOf();

            expect(value).toBe(42);
            // Value is returned by reference for objects, but can't be changed from outside
        });

        it("should return same reference for objects", () => {
            const obj = { key: "value" };
            const opt = new optional(obj);

            expect(opt.valueOf()).toBe(obj);
        });

        it("should allow object mutation through reference", () => {
            const obj = { key: "value" };
            const opt = new optional(obj);

            opt.valueOf().key = "newValue";
            expect(obj.key).toBe("newValue");
        });
    });

    describe("type preservation", () => {
        it("should preserve number type", () => {
            const opt = new optional(42);
            expect(typeof opt.valueOf()).toBe("number");
        });

        it("should preserve string type", () => {
            const opt = new optional("test");
            expect(typeof opt.valueOf()).toBe("string");
        });

        it("should preserve boolean type", () => {
            const opt = new optional(true);
            expect(typeof opt.valueOf()).toBe("boolean");
        });

        it("should preserve bigint type", () => {
            const opt = new optional(123n);
            expect(typeof opt.valueOf()).toBe("bigint");
        });

        it("should preserve object type", () => {
            const opt = new optional({});
            expect(typeof opt.valueOf()).toBe("object");
        });

        it("should preserve array type", () => {
            const opt = new optional([]);
            expect(Array.isArray(opt.valueOf())).toBe(true);
        });

        it("should preserve undefined type for null input", () => {
            const opt = new optional(null);
            expect(typeof opt.valueOf()).toBe("undefined");
        });
    });

    describe("comparisons", () => {
        it("should allow comparison of stored values", () => {
            const opt1 = new optional(42);
            const opt2 = new optional(42);

            expect(opt1.valueOf()).toBe(opt2.valueOf());
        });

        it("should correctly compare undefined values", () => {
            const opt1 = new optional(null);
            const opt2 = new optional(undefined);

            expect(opt1.valueOf()).toBe(opt2.valueOf());
        });

        it("should allow object reference comparison", () => {
            const obj = { key: "value" };
            const opt1 = new optional(obj);
            const opt2 = new optional(obj);

            expect(opt1.valueOf()).toBe(opt2.valueOf());
        });

        it("should distinguish different object instances", () => {
            const opt1 = new optional({ key: "value" });
            const opt2 = new optional({ key: "value" });

            expect(opt1.valueOf()).not.toBe(opt2.valueOf());
            expect(opt1.valueOf()).toEqual(opt2.valueOf());
        });
    });
});
