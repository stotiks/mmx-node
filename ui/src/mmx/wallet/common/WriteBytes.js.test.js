import { assert, describe, expect, it } from "vitest";
import { WriteBytes } from "./WriteBytes";

import { toUpperHex } from "../utils/Uint8ArrayUtils";

describe("WriteBuffer", () => {
    const version = 0;
    it("empty", () => {
        const wb = new WriteBytes(version);
        assert.equal(toUpperHex(wb.buffer), "");
    });

    it("field without value", () => {
        const wb = new WriteBytes(version);
        wb.write_field("field");
        assert.equal(toUpperHex(wb.buffer), "6669656C643C3E737472696E673C3E05000000000000006669656C64");
    });

    it("unknown type", () => {
        const wb = new WriteBytes(version);
        expect(() => wb.write_field("field", Symbol("unknown object type"))).toThrow();
    });

    it("unknown object type", () => {
        const wb = new WriteBytes(version);
        expect(() => wb.write_field("field", {})).toThrow();
    });

    it("invalid number", () => {
        const wb = new WriteBytes(version);
        expect(() => wb.write_field("field", -0x7fffffff - 2)).toThrow();
    });

    it("invalid number [float]", () => {
        const wb = new WriteBytes(version);
        expect(() => wb.write_field("field", -1337.1337)).toThrow();
    });
});
