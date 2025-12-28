import { describe, it, assert, expect } from "vitest";
import { hexToBytes } from "@noble/hashes/utils.js";
import { addr_t, bytes_t, hash_t } from "./addr_t";

import "../utils/Uint8ArrayUtils";

describe("bytes_t", () => {
    it("empty to bytes_t", () => {
        const bytes = new bytes_t();
        assert.equal(bytes.toString(), "");
    });

    const int8Array = Uint8Array.from([0xca, 0xfe, 0x01, 0x23]);
    const str = int8Array.toHex();

    it("Uint8Array to bytes_t", () => {
        const int8Array = Uint8Array.from([0xca, 0xfe, 0x01, 0x23]);
        const bytes = new bytes_t(int8Array);
        assert.equal(bytes.toString(), str);
    });

    it("str to bytes_t", () => {
        const bytes = new bytes_t(str);
        assert.equal(bytes.toString(), str);
    });

    it("invalid input type", () => {
        expect(() => new bytes_t(666)).toThrowError();
    });
});

describe("addr_t", () => {
    const addrStr = "mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a";
    const addrHex = "72E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C5";

    it("str to bytes", () => {
        const addr = new addr_t(addrStr);
        assert.equal(addr.toString(), addrStr);
        assert.equal(addr.toHex(), addrHex);
    });

    it("bytes to str", () => {
        const addr = new addr_t(hexToBytes(addrHex));
        assert.equal(addr.toString(), addrStr);
        assert.equal(addr.toHex(), addrHex);
    });

    it("empty", () => {
        const addrEmptyHex = "0000000000000000000000000000000000000000000000000000000000000000";
        const addrStrEmpty = "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev";

        const addr = new addr_t();
        assert.equal(addr.toString(), addrStrEmpty);
        assert.equal(addr.toHex(), addrEmptyHex);
    });

    it("invalid address prefix", () => {
        const invalidAddr = "xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2u30kz";
        expect(() => new addr_t(invalidAddr)).toThrowError();
    });

    it("invalid input type", () => {
        expect(() => new addr_t(0)).toThrowError();
    });

    it("invalid length", () => {
        expect(() => new addr_t(new Uint8Array(0))).toThrowError();
        expect(() => new addr_t(new Uint8Array(31))).toThrowError();
    });
});

describe("hash_t", () => {
    it("empty to bytes_t", () => {
        const hash = new hash_t();
        assert.equal(hash.toString(), "0000000000000000000000000000000000000000000000000000000000000000");
    });

    it("str to hash", () => {
        const str = "test";
        const hash = new hash_t(str);
        assert.equal(hash.toString(), "9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08");
    });

    it("bytes to hash", () => {
        const bytes = hexToBytes("FF");
        const hash = new hash_t(bytes);
        assert.equal(hash.toString(), "A8100AE6AA1940D0B663BB31CD466142EBBDBD5187131B92D93818987832EB89");
    });

    it("invalid input type", () => {
        expect(() => new hash_t(666)).toThrowError();
    });
});
