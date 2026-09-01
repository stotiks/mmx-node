import { assert, describe, it } from "vitest";

import { addr_t, bytes_t } from "./addr_t";
import { uint128 } from "./uint128";
import { optional } from "./optional";
import { pair } from "./pair";
import { txin_t, txout_t } from "./txio_t";
import { Variant } from "./Variant";
import { vnxObject } from "./vnxObject";

import { WriteBytes } from "./WriteBytes";

import { toUpperHex } from "../utils/Uint8ArrayUtils";

describe.concurrent("WriteBuffer", () => {
    it("nullptr {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", null);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500";
        assert.equal(jsHex, cppHex);
    });

    it("bool true {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", true);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6501";
        assert.equal(jsHex, cppHex);
    });

    it("bool false {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", false);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 0n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 18446744073709551615n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 4294967295);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFF00000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 65535);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFF000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 77);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654D00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 255);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", -9223372036854775808n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000080";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 9223372036854775807n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFF7F";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", -2147483648);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500000080FFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 2147483647);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFF7F00000000";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", -32768);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650080FFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 32767);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FF7F000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 77);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654D00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", -128);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6580FFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", 127);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D657F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new uint128("0x13371337133713371337133713371337"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6537133713371337133713371337133713";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new uint128("0x00"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500000000000000000000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new uint128("0xffffffffffffffffffffffffffffffff"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("string {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", "string");
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65737472696E673C3E0600000000000000737472696E67";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field(
            "field_name",
            new bytes_t(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t empty {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new bytes_t());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t addr_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new addr_t("mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C5";
        assert.equal(jsHex, cppHex);
    });

    it("vector {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("vector string {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", ["1337", "hello", "world"]);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0300000000000000737472696E673C3E040000000000000031333337737472696E673C3E050000000000000068656C6C6F737472696E673C3E0500000000000000776F726C64";
        assert.equal(jsHex, cppHex);
    });

    it("vector uint64_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E100000000000000000000000000000000100000000000000020000000000000003000000000000000400000000000000050000000000000006000000000000000700000000000000080000000000000009000000000000000A000000000000000B000000000000000C000000000000000D000000000000000E000000000000000F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("vector empty {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Uint8Array([]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant empty {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654E554C4C";
        assert.equal(jsHex, cppHex);
    });

    it("Variant bool true {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(true));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6501";
        assert.equal(jsHex, cppHex);
    });

    it("Variant bool false {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(false));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(255));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant string {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant("1337"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65737472696E673C3E040000000000000031333337";
        assert.equal(jsHex, cppHex);
    });

    it("Variant vector {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E100000000000000000000000000000000100000000000000020000000000000003000000000000000400000000000000050000000000000006000000000000000700000000000000080000000000000009000000000000000A000000000000000B000000000000000C000000000000000D000000000000000E000000000000000F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant vnx::Object {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(new vnxObject({ field1: "1337", field2: 1337 })));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0200000000000000706169723C3E737472696E673C3E06000000000000006669656C6431737472696E673C3E040000000000000031333337706169723C3E737472696E673C3E06000000000000006669656C64323905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(1337n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(-9223372036854775808n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000080";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(9223372036854775807n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFF7F";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(1337n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t min {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(0n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t max {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Variant(18446744073709551615n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("vnx::Object {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new vnxObject({ field1: "1337", field2: 1337 }));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0200000000000000706169723C3E737472696E673C3E06000000000000006669656C6431737472696E673C3E040000000000000031333337706169723C3E737472696E673C3E06000000000000006669656C64323905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("vnx::Object empty {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new vnxObject());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("txout_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field(
            "field_name",
            new txout_t({
                address: "mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a",
                contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 255,
                memo: "memo",
            })
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6574786F75745F743C3E62797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C562797465733C3E20000000000000000000000000000000000000000000000000000000000000000000000000000000FF0000000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E04000000000000006D656D6F";
        assert.equal(jsHex, cppHex);
    });

    it("txin_t {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field(
            "field_name",
            new txin_t({
                address: "mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a",
                contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 255,
                memo: "memo",
                solution: 255,
                flags: 255,
            })
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D657478696E5F743C3E62797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C562797465733C3E20000000000000000000000000000000000000000000000000000000000000000000000000000000FF0000000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E04000000000000006D656D6F";
        assert.equal(jsHex, cppHex);
    });

    it("optional {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field(
            "field_name",
            new optional(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F7074696F6E616C3C3E0162797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("optional nullptr {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new optional(null));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F7074696F6E616C3C3E00";
        assert.equal(jsHex, cppHex);
    });

    it("pair {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new pair("test1", 255));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65706169723C3E737472696E673C3E05000000000000007465737431FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("map {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field(
            "field_name",
            new Map([
                ["test1", 255],
                ["test2", 255],
            ])
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0200000000000000706169723C3E737472696E673C3E05000000000000007465737431FF00000000000000706169723C3E737472696E673C3E05000000000000007465737432FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("map empty {v0}", () => {
        const wb = new WriteBytes(0);
        wb.write_field("field_name", new Map([]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("nullptr {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", null);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500";
        assert.equal(jsHex, cppHex);
    });

    it("bool true {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", true);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6501";
        assert.equal(jsHex, cppHex);
    });

    it("bool false {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", false);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 0n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint64_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 18446744073709551615n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint32_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 4294967295);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFF00000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint16_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 65535);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFF000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 77);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654D00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 0);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint8_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 255);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", -9223372036854775808n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650000000000000080";
        assert.equal(jsHex, cppHex);
    });

    it("int64_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 9223372036854775807n);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFF7F";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", -2147483648);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500000080FFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int32_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 2147483647);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFF7F00000000";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 1337);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", -32768);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D650080FFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int16_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 32767);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FF7F000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 77);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654D00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", -128);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6580FFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("int8_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", 127);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D657F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new uint128("0x13371337133713371337133713371337"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6537133713371337133713371337133713";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new uint128("0x00"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6500000000000000000000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("uint128 max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new uint128("0xffffffffffffffffffffffffffffffff"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("string {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", "string");
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65737472696E673C3E0600000000000000737472696E67";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field(
            "field_name",
            new bytes_t(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t empty {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new bytes_t());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("bytes_t addr_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new addr_t("mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C5";
        assert.equal(jsHex, cppHex);
    });

    it("vector {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("vector string {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", ["1337", "hello", "world"]);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0300000000000000737472696E673C3E040000000000000031333337737472696E673C3E050000000000000068656C6C6F737472696E673C3E0500000000000000776F726C64";
        assert.equal(jsHex, cppHex);
    });

    it("vector uint64_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E100000000000000000000000000000000100000000000000020000000000000003000000000000000400000000000000050000000000000006000000000000000700000000000000080000000000000009000000000000000A000000000000000B000000000000000C000000000000000D000000000000000E000000000000000F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("vector empty {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Uint8Array([]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6562797465733C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant empty {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D654E554C4C";
        assert.equal(jsHex, cppHex);
    });

    it("Variant bool true {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(true));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C626F6F6C3E01";
        assert.equal(jsHex, cppHex);
    });

    it("Variant bool false {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(false));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C626F6F6C3E00";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(255));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343EFF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant string {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant("1337"));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65737472696E673C3E040000000000000031333337";
        assert.equal(jsHex, cppHex);
    });

    it("Variant vector {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6576617269616E743C3E766563746F723C3E10000000000000003C7536343E00000000000000003C7536343E01000000000000003C7536343E02000000000000003C7536343E03000000000000003C7536343E04000000000000003C7536343E05000000000000003C7536343E06000000000000003C7536343E07000000000000003C7536343E08000000000000003C7536343E09000000000000003C7536343E0A000000000000003C7536343E0B000000000000003C7536343E0C000000000000003C7536343E0D000000000000003C7536343E0E000000000000003C7536343E0F00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant vnx::Object {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(new vnxObject({ field1: "1337", field2: 1337 })));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0200000000000000706169723C3E737472696E673C3E06000000000000006669656C6431737472696E673C3E040000000000000031333337706169723C3E737472696E673C3E06000000000000006669656C64323C7536343E3905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(1337n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343E3905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(-9223372036854775808n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C6936343E0000000000000080";
        assert.equal(jsHex, cppHex);
    });

    it("Variant int64_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(9223372036854775807n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343EFFFFFFFFFFFFFF7F";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(1337n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343E3905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t min {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(0n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("Variant uint64_t max {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Variant(18446744073709551615n));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D653C7536343EFFFFFFFFFFFFFFFF";
        assert.equal(jsHex, cppHex);
    });

    it("vnx::Object {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new vnxObject({ field1: "1337", field2: 1337 }));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0200000000000000706169723C3E737472696E673C3E06000000000000006669656C6431737472696E673C3E040000000000000031333337706169723C3E737472696E673C3E06000000000000006669656C64323C7536343E3905000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("vnx::Object empty {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new vnxObject());
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F626A6563743C3E766563746F723C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("txout_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field(
            "field_name",
            new txout_t({
                address: "mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a",
                contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 255,
                memo: "memo",
            })
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D6574786F75745F743C3E62797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C562797465733C3E20000000000000000000000000000000000000000000000000000000000000000000000000000000FF0000000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E04000000000000006D656D6F";
        assert.equal(jsHex, cppHex);
    });

    it("txin_t {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field(
            "field_name",
            new txin_t({
                address: "mmx1ckyz0x7fpet4y7zmckyg7lklp8dc5gdr2kjd8hamk49rnk8zu9eq2cnz7a",
                contract: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 255,
                memo: "memo",
                solution: 255,
                flags: 255,
            })
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D657478696E5F743C3E62797465733C3E200000000000000072E1E2D8394AB5BBDFD3A455A3218ADB09DF7E8F88C55B7852570EC99B2788C562797465733C3E20000000000000000000000000000000000000000000000000000000000000000000000000000000FF0000000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E04000000000000006D656D6F";
        assert.equal(jsHex, cppHex);
    });

    it("optional {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field(
            "field_name",
            new optional(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F7074696F6E616C3C3E0162797465733C3E1000000000000000000102030405060708090A0B0C0D0E0F";
        assert.equal(jsHex, cppHex);
    });

    it("optional nullptr {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new optional(null));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex = "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D656F7074696F6E616C3C3E00";
        assert.equal(jsHex, cppHex);
    });

    it("pair {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new pair("test1", 255));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65706169723C3E737472696E673C3E05000000000000007465737431FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("map {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field(
            "field_name",
            new Map([
                ["test1", 255],
                ["test2", 255],
            ])
        );
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0200000000000000706169723C3E737472696E673C3E05000000000000007465737431FF00000000000000706169723C3E737472696E673C3E05000000000000007465737432FF00000000000000";
        assert.equal(jsHex, cppHex);
    });

    it("map empty {v1}", () => {
        const wb = new WriteBytes(1);
        wb.write_field("field_name", new Map([]));
        const jsHex = toUpperHex(wb.buffer);
        const cppHex =
            "6669656C643C3E737472696E673C3E0A000000000000006669656C645F6E616D65766563746F723C3E0000000000000000";
        assert.equal(jsHex, cppHex);
    });
});
