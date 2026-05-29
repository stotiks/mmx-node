import { describe, it, assert, expect } from "vitest";
import { uint128 } from "./uint128";
import { get_inv_price, get_price } from "./offer_data_t";

describe("offer_data_t", () => {
    const getPriceTests = [
        //
        { hex: "0x1", price: 18446744073709551616 },
        { hex: "0x10000000000000000", price: 1 },
        { hex: "0x4189374bc6a7f0", price: 1000 },
        { hex: "0x4189374bc6a7ef", price: 1000 },
        { hex: "0x4180d4e2b3e0c8", price: 1000.5 },
        { hex: "0x419a02900419a0", price: 999 },
        { hex: "0x4178749e8fba70", price: 1001 },

        { hex: "0x419a02900419a0", price: 999 },
        { hex: "0x4198543fa5ce8c", price: 999.1000000000000227373675443232059478759765625 },
        { hex: "0x4196a605543d7c", price: 999.200000000000045474735088646411895751953125 },
        { hex: "0x4194f7e10db4a0", price: 999.3000000000000682121026329696178436279296875 },
        { hex: "0x419349d2d08254", price: 999.40000000000009094947017729282379150390625 },
        { hex: "0x41919bda9af51c", price: 999.5000000000001136868377216160297393798828125 },
        { hex: "0x418fedf86b5bac", price: 999.600000000000136424205265939235687255859375 },
        { hex: "0x418e402c4004e8", price: 999.7000000000001591615728102624416351318359375 },
        { hex: "0x418c9276173fd8", price: 999.8000000000001818989403545856475830078125 },
        { hex: "0x418ae4d5ef5bb8", price: 999.9000000000002046363078989088535308837890625 },
        { hex: "0x4189374bc6a7ec", price: 1000.000000000000227373675443232059478759765625 },
        { hex: "0x418789d79b7404", price: 1000.1000000000002501110429875552654266357421875 },
        { hex: "0x4185dc796c0fc0", price: 1000.20000000000027284841053187847137451171875 },
        { hex: "0x41842f3136cb08", price: 1000.3000000000002955857780762016773223876953125 },
        { hex: "0x418281fef9f5f4", price: 1000.4000000000002046363078989088535308837890625 },
        { hex: "0x4180d4e2b3e0c4", price: 1000.500000000000227373675443232059478759765625 },
        { hex: "0x417f27dc62dbe8", price: 1000.6000000000002501110429875552654266357421875 },
        { hex: "0x417d7aec0537f8", price: 1000.7000000000003865352482534945011138916015625 },
        { hex: "0x417bce119945c0", price: 1000.800000000000409272615797817707061767578125 },
        { hex: "0x417a214d1d5630", price: 1000.9000000000004320099833421409130096435546875 },
    ];

    getPriceTests.forEach(({ hex, price }) => {
        it(`get_price ${price}`, () => {
            const res = get_price(new uint128(hex));
            assert.equal(price, res);
        });
    });

    const getInvPriceTests = [
        { inv_price_hex: "0x10000000000000000", ask_amount: 1, bid_amount: 1, price: 1 },
        { inv_price_hex: "0x1", ask_amount: 18446744073709551616, bid_amount: 1, price: 18446744073709551616 },
        { inv_price_hex: "0x4189374bc6a7ef", ask_amount: 100000, bid_amount: 100, price: 1000 },
        { inv_price_hex: "0x41890c58c5093e", ask_amount: 100001, bid_amount: 100, price: 1000.01 },
        { inv_price_hex: "0x418789d79b7408", ask_amount: 100010, bid_amount: 100, price: 1000.1 },
        { inv_price_hex: "0x4185dc796c0fc4", ask_amount: 100020, bid_amount: 100, price: 1000.2 },
        { inv_price_hex: "0x41842f3136cb0c", ask_amount: 100030, bid_amount: 100, price: 1000.3000000000001 },
        { inv_price_hex: "0x418281fef9f5f8", ask_amount: 100040, bid_amount: 100, price: 1000.4 },
        { inv_price_hex: "0x4180d4e2b3e0c8", ask_amount: 100050, bid_amount: 100, price: 1000.5 },
        { inv_price_hex: "0x417f27dc62dbec", ask_amount: 100060, bid_amount: 100, price: 1000.6 },
        { inv_price_hex: "0x417d7aec0537ff", ask_amount: 100070, bid_amount: 100, price: 1000.7 },
        { inv_price_hex: "0x417bce119945c7", ask_amount: 100080, bid_amount: 100, price: 1000.8000000000001 },
        { inv_price_hex: "0x417a214d1d5638", ask_amount: 100090, bid_amount: 100, price: 1000.9 },
        { inv_price_hex: "0x4178749e8fba70", ask_amount: 100100, bid_amount: 100, price: 1001 },
    ];

    getInvPriceTests.forEach(({ inv_price_hex, ask_amount, bid_amount, price }) => {
        it(`get_price ${price}`, () => {
            const res = get_price(new uint128(inv_price_hex));
            assert.equal(res, price);
        });
    });

    getInvPriceTests.forEach(({ inv_price_hex, ask_amount, bid_amount, price }) => {
        it(`get_inv_price ${price}`, () => {
            const inv_price = get_inv_price(bid_amount, ask_amount);
            assert.equal(inv_price.toHex(), inv_price_hex);
        });
    });
});
