import { describe, it, assert, expect } from "vitest";
import { uint128 } from "./uint128";
import { get_inv_price, get_price } from "./offer_data_t";

describe("offer_data_t", () => {
    it("get_price", () => {
        const inv_price = new uint128("0x4189374bc6a7f0");
        const price = get_price(inv_price);
        assert.equal(price, 1000);
    });

    it("get_inv_price", () => {
        const price = 1000;
        const inv_price = get_inv_price(price);
        assert.equal(inv_price.toHex(), "0x4189374bc6a7f0");
    });
});
