import { describe, it, expect } from "vitest";
import rules from "./rules";

describe("rules", () => {
    it("should be an object", () => {
        expect(typeof rules).toBe("object");
    });

    describe("required", () => {
        it("should return true for non-empty values", () => {
            expect(rules.required("some value")).toBe(true);
            expect(rules.required(123)).toBe(true);
            expect(rules.required(0)).toBe(true); // 0 is a value
        });

        it("should return error message for empty values", () => {
            expect(rules.required("")).toBe("Field is required");
            expect(rules.required(null)).toBe("Field is required");
            expect(rules.required(undefined)).toBe("Field is required");
            expect(rules.required("   ")).toBe("Field is required"); // isEmpty checks for trim().length === 0
        });
    });

    describe("number", () => {
        it("should return true for empty values (optional)", () => {
            expect(rules.number("")).toBe(true);
            expect(rules.number(null)).toBe(true);
            expect(rules.number(undefined)).toBe(true);
        });

        it("should return true for valid non-negative numbers", () => {
            expect(rules.number("123")).toBe(true);
            expect(rules.number("0")).toBe(true);
        });

        it("should return error message for invalid numbers", () => {
            expect(rules.number("abc")).toBe("Invalid number");
            expect(rules.number("12.34")).toBe("Invalid number"); // Regex is /^\d+$/
            expect(rules.number("-1")).toBe("Invalid number");
            expect(rules.number("12a")).toBe("Invalid number");
        });
    });

    describe("address", () => {
        const validAddress = "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6";

        it("should return true for empty values (optional)", () => {
            expect(rules.address("")).toBe(true);
            expect(rules.address(null)).toBe(true);
            expect(rules.address(undefined)).toBe(true);
        });

        it("should return true for valid mmx address", () => {
            expect(rules.address(validAddress)).toBe(true);
        });

        it("should return error message for invalid address", () => {
            expect(rules.address("invalid-address")).toBe("Invalid address");
            expect(rules.address("mmx1invalid")).toBe("Invalid address");
        });
    });

    describe("amount", () => {
        it("should return true for empty values (optional)", () => {
            expect(rules.amount("")).toBe(true);
            expect(rules.amount(null)).toBe(true);
            expect(rules.amount(undefined)).toBe(true);
        });

        it("should return true for valid positive numbers", () => {
            expect(rules.amount(10)).toBe(true);
            expect(rules.amount(0.5)).toBe(true);
        });

        it("should return error message for invalid amounts", () => {
            expect(rules.amount(0)).toBe("Invalid amount"); // value > 0
            expect(rules.amount(-5)).toBe("Invalid amount");
            expect(rules.amount("10")).toBe("Invalid amount"); // typeof value === "number"
        });
    });

    describe("memo", () => {
        it("should return true for valid memo", () => {
            expect(rules.memo("Short memo")).toBe(true);
            expect(rules.memo("")).toBe(true);
            expect(rules.memo(null)).toBe(true);
        });

        it("should return error message for memo longer than 64 chars", () => {
            const longMemo = "a".repeat(65);
            expect(rules.memo(longMemo)).toBe("Maximum length is 64");
        });

        it("should return true for memo with exactly 64 chars", () => {
            const maxMemo = "a".repeat(64);
            expect(rules.memo(maxMemo)).toBe(true);
        });
    });
});
