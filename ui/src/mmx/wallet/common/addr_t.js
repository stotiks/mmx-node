import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes, isBytes, utf8ToBytes } from "@noble/hashes/utils";
import { bech32m } from "@scure/base";

export class bytes_t extends Uint8Array {
    constructor(bytes) {
        if (bytes == undefined) {
            super();
        } else if (isBytes(bytes)) {
            super(bytes);
        } else if (typeof bytes == "string") {
            super(hexToBytes(bytes));
        } else {
            throw new Error(`Invalid bytes type ${typeof bytes}`);
        }
    }

    toString() {
        return bytesToHex(this.valueOf());
    }
}

export class addr_t extends bytes_t {
    static prefix = "mmx";
    constructor(addr) {
        if (typeof addr == "string") {
            const decoded = bech32m.decodeToBytes(addr);
            const { prefix, bytes } = decoded;
            if (prefix != addr_t.prefix) {
                throw new Error("Invalid address prefix");
            }
            super(bytes.toReversed());
        } else if (isBytes(addr)) {
            if (addr.length != 32) throw new Error("Invalid address length");
            super(addr);
        } else if (addr == undefined) {
            super(new Uint8Array(32));
        } else {
            throw new Error(`Invalid address type ${typeof addr}`);
        }
    }

    toString() {
        return bech32m.encodeFromBytes(addr_t.prefix, this.toReversed());
    }
}
export class hash_t extends bytes_t {
    constructor(data) {
        if (data == undefined) {
            super(new Uint8Array(32));
        } else {
            super(typeof data == "string" ? sha256(utf8ToBytes(data)) : sha256(data));
        }
    }
}
