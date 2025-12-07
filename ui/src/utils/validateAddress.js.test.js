import { describe, it, expect } from "vitest";
import { validateAddress } from "./validateAddress";
import { bech32m } from "@scure/base";

describe("validateAddress", () => {
    const validAddress = "mmx1cdv0s72kyp8y9f3glg22p32zz450f66rl03hzx5uwzrcrysy0qvq6scyfm";

    it("should return true for a valid MMX address", () => {
        expect(validateAddress(validAddress)).toBe(true);
    });

    it("should return false for an invalid address", () => {
        expect(validateAddress("invalid-address")).toBe(false);
    });

    it("should return false for an address with an incorrect prefix", () => {
        // A valid bech32m address to test prefix check
        const btcAddress = "mmm1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfjuc7a";
        expect(validateAddress(btcAddress)).toBe(false);
    });

    it("should return false for an address with incorrect length", () => {
        expect(validateAddress("mmx1vl3v0x")).toBe(false);
    });

    it("should return false for null or undefined input", () => {
        expect(validateAddress(null)).toBe(false);
        expect(validateAddress(undefined)).toBe(false);
    });
});
