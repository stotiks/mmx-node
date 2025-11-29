import { ChainParams } from "../utils/ChainParams";
import { WriteBytes } from "./WriteBytes";
import { hash_t } from "./addr_t";
import { optional } from "./optional";
import { txin_t, txout_t } from "./txio_t";

class exec_result_t {
    #type_hash = BigInt("0x18fe02e2374b039e");
    __type = "mmx.exec_result_t";

    did_fail = false;
    total_cost = 0;
    total_fee = 0;
    inputs = [];
    outputs = [];
    error = null;

    static hashHandler = {
        get: (target, prop) => {
            switch (prop) {
                case "inputs":
                    return (target.inputs || []).map((i) => new txin_t(i));
                case "outputs":
                    return (target.outputs || []).map((i) => new txout_t(i));
                case "error":
                    return new optional(target.error);
                default:
                    return Reflect.get(target, prop);
            }
        },
    };

    getHashProxy() {
        return new Proxy(this, exec_result_t.hashHandler);
    }

    constructor({ did_fail, total_cost, total_fee, inputs, outputs, error } = {}) {
        this.did_fail = did_fail;
        this.total_cost = total_cost;
        this.total_fee = total_fee;
        this.inputs = inputs;
        this.outputs = outputs;
        this.error = error;
    }

    hash_serialize(full_hash) {
        const hp = this.getHashProxy();
        const wb = new WriteBytes();

        wb.write_bytes(this.#type_hash);
        wb.write_field("did_fail", hp.did_fail);
        wb.write_field("total_cost", hp.total_cost);
        wb.write_field("total_fee", hp.total_fee);
        wb.write_field("inputs", hp.inputs);
        wb.write_field("outputs", hp.outputs);
        wb.write_field("error", hp.error.valueOf() ? hp.error.valueOf().calc_hash() : new hash_t());

        return wb.buffer;
    }

    calc_hash(full_hash) {
        const tmp = this.hash_serialize(full_hash);
        const hash = new hash_t(tmp).valueOf();
        return hash;
    }

    calc_cost(_params) {
        const params = new ChainParams(_params);

        const hp = this.getHashProxy();
        let cost = 0n;

        hp.inputs.forEach((i) => (cost += i.calc_cost(params)));
        hp.outputs.forEach((i) => (cost += i.calc_cost(params)));

        return cost;
    }
}

export { exec_result_t };
