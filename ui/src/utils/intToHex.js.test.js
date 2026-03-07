import { describe, it, expect } from "vitest";
import { intToHex } from "./intToHex";

describe("intToHex", () => {
    it("should convert positive numbers to hex", () => {
        expect(intToHex(0)).toBe("0x00");
        expect(intToHex(1)).toBe("0x01");
        expect(intToHex(10)).toBe("0x0a");
        expect(intToHex(255)).toBe("0xff");
        expect(intToHex(256)).toBe("0x0100");
    });

    it("should convert negative numbers to hex using two's complement", () => {
        expect(intToHex(-1)).toBe("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        expect(intToHex(-5)).toBe("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffb");
        expect(intToHex(-10)).toBe("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6");
    });

    it("should handle large positive numbers", () => {
        expect(intToHex(123456789)).toBe("0x075bcd15");
        expect(intToHex(Number.MAX_SAFE_INTEGER)).toBe("0x1fffffffffffff");
    });

    it("should handle large negative numbers", () => {
        expect(intToHex(-123456789)).toBe("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffff8a432eb");
    });

    it("should ensure even length hex output", () => {
        expect(intToHex(0).length).toBe(4); // "0x00"
        expect(intToHex(1).length).toBe(4); // "0x01"
        expect(intToHex(15).length).toBe(4); // "0x0f"
        expect(intToHex(16).length).toBe(4); // "0x10"
    });
});
