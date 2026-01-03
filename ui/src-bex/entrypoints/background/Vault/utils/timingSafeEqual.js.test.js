import { describe, it, expect } from "vitest";
import { timingSafeEqual, timingSafeEqualStr } from "./timingSafeEqual.js";

describe("timingSafeEqual", () => {
    describe("timingSafeEqual", () => {
        it("should return true for identical buffers", () => {
            const buffer1 = Buffer.from("hello world", "utf8");
            const buffer2 = Buffer.from("hello world", "utf8");

            expect(timingSafeEqual(buffer1, buffer2)).toBe(true);
        });

        it("should return false for different buffers", () => {
            const buffer1 = Buffer.from("hello", "utf8");
            const buffer2 = Buffer.from("world", "utf8");

            expect(timingSafeEqual(buffer1, buffer2)).toBe(false);
        });

        it("should return true for empty buffers", () => {
            const buffer1 = Buffer.alloc(0);
            const buffer2 = Buffer.alloc(0);

            expect(timingSafeEqual(buffer1, buffer2)).toBe(true);
        });

        it("should throw TypeError for non-buffer arguments", () => {
            const buffer = Buffer.from("test");

            expect(() => timingSafeEqual("not a buffer", buffer)).toThrow("First argument must be a buffer");
            expect(() => timingSafeEqual(buffer, "not a buffer")).toThrow("Second argument must be a buffer");
        });

        it("should throw TypeError for different length buffers", () => {
            const buffer1 = Buffer.from("short");
            const buffer2 = Buffer.from("much longer buffer");

            expect(() => timingSafeEqual(buffer1, buffer2)).toThrow("Input buffers must have the same length");
        });
    });

    describe("timingSafeEqualStr", () => {
        it("should return true for identical strings", () => {
            expect(timingSafeEqualStr("hello", "hello")).toBe(true);
        });

        it("should return true for empty strings", () => {
            expect(timingSafeEqualStr("", "")).toBe(true);
        });

        it("should return false for different strings", () => {
            expect(timingSafeEqualStr("hello", "world")).toBe(false);
        });

        it("should throw TypeError for non-string arguments", () => {
            expect(() => timingSafeEqualStr(123, "test")).toThrow("First argument must be a string");
            expect(() => timingSafeEqualStr("test", null)).toThrow("Second argument must be a string");
        });

        it("should handle unicode strings correctly", () => {
            expect(timingSafeEqualStr("café", "café")).toBe(true);
            expect(timingSafeEqualStr("🚀", "🚀")).toBe(true);
        });

        it("should be case sensitive", () => {
            expect(timingSafeEqualStr("Hello", "hello")).toBe(false);
        });
    });
});
