import { describe, it, assert } from "vitest";

import { Transaction } from "./Transaction";
import { getChainParamsAsync } from "./utils/getChainParamsAsync";

import "./Transaction.ext";

import { JSONbigNativeString } from "./utils/JSONbigNative";
import "./utils/Uint8ArrayUtils";

import { txs } from "./Transaction.js.txs.test.js";

txs.forEach((item, key) => {
    describe(`Transaction #${key}`, () => {
        const json = item.json;
        const hex = item.hex;

        const _tx = Transaction.parse(json);
        const id = _tx.id;
        const content_hash = _tx.content_hash;

        it("parse", () => {
            const tx = Transaction.parse(json);
            assert.equal(tx.toString(), JSONbigNativeString.stringify(JSONbigNativeString.parse(json)));
        });

        it("calc_hash id", () => {
            const tx = Transaction.parse(json);
            const hash = tx.calc_hash(false);
            assert.equal(hash.toHex(), id);
        });

        it("calc_hash content_hash", () => {
            const tx = Transaction.parse(json);

            const hash_serialize = tx.hash_serialize(item.full_hash ?? true);
            const hash = tx.calc_hash(true);

            assert.equal(hash_serialize.toHex(), hex);
            assert.equal(hash.toHex(), content_hash);
        });

        it("finalize", () => {
            const tx = Transaction.parse(json);
            tx.id = null;
            tx.finalize();
            assert.equal(tx.id, id);
        });

        it("static_cost", async () => {
            const tx = Transaction.parse(json);
            const chainParams = await getChainParamsAsync(tx.network);
            const static_cost = tx.calc_cost(chainParams);
            assert.equal(static_cost, tx.static_cost);
        });
    });
});

describe("Transaction #nonce as string", () => {
    const json =
        '{"__type": "mmx.Transaction", "id": "A533C34FB79C24E982CE91EC079144E4FDAB7AA01C64842C540859F21916891D", "version": 0, "expires": 591204, "fee_ratio": 1024, "static_cost": 60000, "max_fee_amount": 5050000, "note": "TRANSFER", "nonce": "8425803021051778044", "network": "mainnet", "sender": "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6", "inputs": [{"address": "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6", "contract": "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev", "amount": "1000000", "memo": "test", "solution": 0, "flags": 0}], "outputs": [{"address": "mmx1mw38rg8jcy2tjc5r7sxque6z45qrw6dsu6g2wmhahwf30342rraqyhsnea", "contract": "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev", "amount": "1000000", "memo": "test"}], "execute": [], "solutions": [{"__type": "mmx.solution.PubKey", "version": 0, "pubkey": "0344EE96D1B85CAC0F99B7CFA44F39EFFC590BDF51D45099D1F24AA09E5F9AD6E0", "signature": "25D6E0CCC23015E8613CDAA76EBCBFBC65BE1313AAD08BE212E36A1BBE9553CD0D68F10C694A9333D3E2EF48869A033055605A7136250E52F8FA4009158B3B51"}], "deploy": null, "exec_result": null, "content_hash": "7DA9479A3A92E210C8022625E7E5AD5332C3BF166CA5F2C6FCC04E4D0033E646"}';
    const hex =
        "BCA5EADCAC6204CE6669656C643C3E737472696E673C3E070000000000000076657273696F6E00000000000000006669656C643C3E737472696E673C3E07000000000000006578706972657364050900000000006669656C643C3E737472696E673C3E09000000000000006665655F726174696F00040000000000006669656C643C3E737472696E673C3E0E000000000000006D61785F6665655F616D6F756E74900E4D00000000006669656C643C3E737472696E673C3E04000000000000006E6F74657D592C33000000006669656C643C3E737472696E673C3E05000000000000006E6F6E6365FC5334B13477EE746669656C643C3E737472696E673C3E07000000000000006E6574776F726B737472696E673C3E07000000000000006D61696E6E65746669656C643C3E737472696E673C3E060000000000000073656E6465726F7074696F6E616C3C3E0162797465733C3E20000000000000003C19773DC9B0475ACA09957E520DEAFC197B82AC9F78169B7207361B074641D76669656C643C3E737472696E673C3E0600000000000000696E70757473766563746F723C3E01000000000000007478696E5F743C3E62797465733C3E20000000000000003C19773DC9B0475ACA09957E520DEAFC197B82AC9F78169B7207361B074641D762797465733C3E2000000000000000000000000000000000000000000000000000000000000000000000000000000040420F000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E040000000000000074657374000000000000000000000000000000006669656C643C3E737472696E673C3E07000000000000006F757470757473766563746F723C3E010000000000000074786F75745F743C3E62797465733C3E2000000000000000FA18AAC61793BBFD6EA790E6B0693700AD42670E0CF48362B914C1F2A071A2DB62797465733C3E2000000000000000000000000000000000000000000000000000000000000000000000000000000040420F000000000000000000000000006F7074696F6E616C3C3E01737472696E673C3E0400000000000000746573746669656C643C3E737472696E673C3E07000000000000006578656375746500000000000000006669656C643C3E737472696E673C3E06000000000000006465706C6F7962797465733C3E200000000000000000000000000000000000000000000000000000000000000000000000000000006669656C643C3E737472696E673C3E0B000000000000007374617469635F636F737460EA0000000000006669656C643C3E737472696E673C3E0900000000000000736F6C7574696F6E73010000000000000062797465733C3E2000000000000000A4D9B62671EA9EA783CD0C64C976C91445D82F2C1D48C9F79DD07F580C3D8E6C6669656C643C3E737472696E673C3E0B00000000000000657865635F726573756C7462797465733C3E20000000000000000000000000000000000000000000000000000000000000000000000000000000";

    const _tx = Transaction.parse(json);
    const id = _tx.id;
    const content_hash = _tx.content_hash;

    it("parse", () => {
        const tx = Transaction.parse(json);
        assert.equal(tx.toString(), JSONbigNativeString.stringify(JSONbigNativeString.parse(json)));
    });

    it("calc_hash id", () => {
        const tx = Transaction.parse(json);
        const hash = tx.calc_hash(false);
        assert.equal(hash.toHex(), id);
    });

    it("calc_hash content_hash", () => {
        const tx = Transaction.parse(json);

        const hash_serialize = tx.hash_serialize(true);
        const hash = tx.calc_hash(true);

        assert.equal(hash_serialize.toHex(), hex);
        assert.equal(hash.toHex(), content_hash);
    });
});
