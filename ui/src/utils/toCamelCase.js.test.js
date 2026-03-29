import { describe, it, expect } from "vitest";
import { toCamelCase } from "./toCamelCase";

describe("toCamelCase", () => {
    it("converts kebab-case to camelCase", () => {
        expect(toCamelCase("do-something")).toBe("doSomething");
    });

    it("converts multi-segment kebab-case", () => {
        expect(toCamelCase("get-wallet-balance")).toBe("getWalletBalance");
    });

    it("leaves already camelCase strings unchanged", () => {
        expect(toCamelCase("doSomething")).toBe("doSomething");
    });

    it("leaves plain strings without hyphens unchanged", () => {
        expect(toCamelCase("method")).toBe("method");
    });

    it("handles uppercase letters after hyphen", () => {
        expect(toCamelCase("do-Something")).toBe("doSomething");
    });

    it("returns empty string unchanged", () => {
        expect(toCamelCase("")).toBe("");
    });
});
