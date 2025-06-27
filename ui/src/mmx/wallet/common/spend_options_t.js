export class spend_options_t {
    auto_send = true;
    mark_spent = false;
    fee_ratio = 1024;
    gas_limit = 5000000;

    expire_at = null;
    expire_delta = null;
    nonce = null;
    user = null;
    sender = null;
    passphrase = null;
    note = null;
    memo = null;
    owner_map = new Map();
    contract_map = new Map();

    constructor(options) {
        if (!options) {
            throw new Error("options is required");
        }

        if (typeof options !== "object") {
            throw new Error("options must be an object");
        }

        if (!options.network) {
            throw new Error("network is required");
        }

        if (!options.expire_at) {
            throw new Error("expire_at is required");
        }

        if (options.nonce) {
            options.nonce = BigInt(options.nonce);
        }

        Object.assign(this, options);
    }
}
