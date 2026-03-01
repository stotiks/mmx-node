import { describe, it, expect } from "vitest";
import { NullToStr, StrToNull, isEmpty } from "./nullUtils";

describe("nullUtils", () => {
    describe("NullToStr", () => {
        it('should convert falsy values to "null"', () => {
            expect(NullToStr(null)).toBe("null");
            expect(NullToStr(undefined)).toBe("null");
            expect(NullToStr("")).toBe("null");
        });

        it("should return the original string if it is not falsy", () => {
            expect(NullToStr("hello")).toBe("hello");
            expect(NullToStr("0")).toBe("0");
        });

        it("should return the original value for number 0", () => {
            expect(NullToStr(0)).toBe(0);
        });
    });

    describe("StrToNull", () => {
        it('should convert the string "null" to null', () => {
            expect(StrToNull("null")).toBe(null);
        });

        it('should return the original string if it is not "null"', () => {
            expect(StrToNull("hello")).toBe("hello");
            expect(StrToNull("")).toBe("");
        });
    });

    describe("isEmpty", () => {
        it("should return true for null or undefined", () => {
            expect(isEmpty(null)).toBe(true);
            expect(isEmpty(undefined)).toBe(true);
        });

        it("should return true for empty or whitespace-only strings", () => {
            expect(isEmpty("")).toBe(true);
            expect(isEmpty("   ")).toBe(true);
        });

        it("should return false for non-empty strings", () => {
            expect(isEmpty("hello")).toBe(false);
            expect(isEmpty("  a  ")).toBe(false);
        });

        it("should return false for other types that are not null/undefined", () => {
            expect(isEmpty(0)).toBe(false);
            expect(isEmpty(123)).toBe(false);
            expect(isEmpty({})).toBe(false);
            expect(isEmpty([])).toBe(false);
            expect(isEmpty(false)).toBe(false);
        });
    });
});
