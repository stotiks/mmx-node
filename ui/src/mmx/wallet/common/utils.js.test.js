import { assert, describe, expect, it } from "vitest";
import { bigIntMax, bigIntMin, cost_to_fee, get_num_bytes } from "./utils";
import { Variant } from "./Variant";

describe("utils cost_to_fee", () => {
    it("#1", () => {
        assert.equal(cost_to_fee(0, 2048), 0n);
    });

    it("#2", () => {
        assert.equal(cost_to_fee(1, 2048), 2n);
    });

    it("#3", () => {
        const value = Number.MAX_SAFE_INTEGER;
        assert.equal(cost_to_fee(value, 2048), 2n * BigInt(value));
    });
});

describe("utils bigIntMin", () => {
    it("throws with no arguments", () => {
        expect(() => bigIntMin()).toThrowError("bigIntMin requires at least one argument");
    });
    it("returns single argument", () => {
        expect(bigIntMin(1n)).toBe(1n);
    });
    it("returns minimum of two arguments", () => {
        expect(bigIntMin(1n, 2n)).toBe(1n);
        expect(bigIntMin(2n, 1n)).toBe(1n);
    });
    it("returns minimum of multiple arguments", () => {
        expect(bigIntMin(3n, 1n, 2n)).toBe(1n);
    });
    it("returns minimum with negative numbers", () => {
        expect(bigIntMin(-1n, -2n, -3n)).toBe(-3n);
        expect(bigIntMin(-1n, 2n, -3n)).toBe(-3n);
    });
});

describe("utils bigIntMax", () => {
    it("throws with no arguments", () => {
        expect(() => bigIntMax()).toThrowError("bigIntMax requires at least one argument");
    });
    it("returns single argument", () => {
        expect(bigIntMax(1n)).toBe(1n);
    });
    it("returns maximum of two arguments", () => {
        expect(bigIntMax(1n, 2n)).toBe(2n);
        expect(bigIntMax(2n, 1n)).toBe(2n);
    });
    it("returns maximum of multiple arguments", () => {
        expect(bigIntMax(3n, 1n, 2n)).toBe(3n);
    });
    it("returns maximum with negative numbers", () => {
        expect(bigIntMax(-1n, -2n, -3n)).toBe(-1n);
        expect(bigIntMax(-1n, 2n, -3n)).toBe(2n);
    });
});

describe("utils get_num_bytes", () => {
    it("invalid type", () => {
        expect(() => get_num_bytes(Symbol("invalid type"))).toThrowError("Invalid type");
    });
    it("null", () => {
        assert.equal(get_num_bytes(new Variant(null)), 1);
    });

    it("boolean", () => {
        assert.equal(get_num_bytes(new Variant(true)), 1);
        assert.equal(get_num_bytes(new Variant(false)), 1);
    });

    it("number", () => {
        assert.equal(get_num_bytes(new Variant(123)), 8);
    });

    it("bigint", () => {
        assert.equal(get_num_bytes(new Variant(123n)), 8);
    });

    it("string", () => {
        assert.equal(get_num_bytes(new Variant("")), 4);
        assert.equal(get_num_bytes(new Variant("hello")), 4 + 5);
    });

    it("array", () => {
        assert.equal(get_num_bytes(new Variant([])), 4);
        assert.equal(get_num_bytes(new Variant([1, 2, 3])), 4 + 8 + 8 + 8);
        assert.equal(get_num_bytes(new Variant(["a", "b"])), 4 + (4 + 1) + (4 + 1));
        assert.equal(get_num_bytes(new Variant([true, null])), 4 + 1 + 1);
    });

    it("object", () => {
        assert.equal(get_num_bytes(new Variant({})), 4);
        assert.equal(get_num_bytes(new Variant({ a: 1 })), 4 + 1 + 8);
        assert.equal(get_num_bytes(new Variant({ foo: "bar" })), 4 + 3 + (4 + 3));
        assert.equal(get_num_bytes(new Variant({ a: 1, b: true })), 4 + (1 + 8) + (1 + 1));
    });

    it("nested", () => {
        const value = {
            a: [1, "foo"],
            b: { c: true },
        };
        const expected = 4 + (1 + (4 + 8 + (4 + 3))) + (1 + (4 + 1 + 1));
        assert.equal(get_num_bytes(new Variant(value)), expected);
    });
});
