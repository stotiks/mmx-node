import { hmac } from "@noble/hashes/hmac";
import { sha256, sha512 } from "@noble/hashes/sha2";
import { hexToBytes, isBytes, u32, u8 } from "@noble/hashes/utils";

import * as secp256k1 from "@noble/secp256k1";
secp256k1.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp256k1.hashes.sha256 = sha256;
secp256k1.hashes.hmacSha256Async = async (key, msg) => hmac(sha256, key, msg);
secp256k1.hashes.sha256Async = async (msg) => sha256(msg);

import { addr_t, hash_t } from "@/mmx/wallet/common/addr_t";
import "@/mmx/wallet/utils/Uint8ArrayUtils";

const KDF_ITERS = 4096;

const kdf_hmac_sha512 = (message, key, iterations) => {
    let tmp = new Uint8Array(key);
    for (let i = 0; i < iterations; ++i) {
        tmp = hmac.create(sha512, tmp).update(message).digest();
    }
    return tmp;
};

const hmac_sha512_n = (message, key, index) => {
    const indexArr = u8(new Uint32Array([index])).toReversed();
    const tmp = hmac.create(sha512, key).update(message).update(indexArr).digest();
    return tmp;
};

const getFarmerKey = (seed_value) => {
    const master = kdf_hmac_sha512(seed_value, new hash_t("MMX/farmer_keys"), KDF_ITERS);

    const tmp = hmac_sha512_n(master.first, master.second, 0);
    const pubKey = secp256k1.getPublicKey(tmp.first);
    return pubKey;
};

const getKeys = (seed_value, passphrase, index) => {
    const master = kdf_hmac_sha512(seed_value, new hash_t("MMX/seed/" + passphrase), KDF_ITERS);

    const chain = hmac_sha512_n(master.first, master.second, 11337);
    const account = hmac_sha512_n(chain.first, chain.second, 0);

    const tmp = hmac_sha512_n(account.first, account.second, index);
    const privKey = tmp.first;
    const pubKey = secp256k1.getPublicKey(privKey);
    return { privKey, pubKey };
};

const getAddress = (seed_value, passphrase, index) => {
    const { pubKey } = getKeys(seed_value, passphrase, index);
    const addr = new hash_t(pubKey);

    const addrStr = new addr_t(addr).toString();
    return addrStr;
};

const getFingerPrint = (seed_value, passphrase) => {
    let pass_hash = new Uint8Array(32);
    if (passphrase) {
        pass_hash = new hash_t("MMX/fingerprint/" + passphrase);
    }

    let hash = new Uint8Array(32);
    for (let i = 0; i < 16384; ++i) {
        hash = new hash_t(new Uint8Array([...hash, ...seed_value, ...pass_hash]));
    }

    const fingerPrint = u32(hash)[0];
    return fingerPrint;
};

const ensureBytes = (hex) => (isBytes(hex) ? hex : hexToBytes(hex));

const _prepareSignArgs = (privKey, msg) => {
    const bytes = ensureBytes(msg);
    return [bytes, privKey, { prehash: false }];
};

const sign = (privKey, msg) => {
    return secp256k1.sign(..._prepareSignArgs(privKey, msg));
};

const signAsync = (privKey, msg) => {
    return secp256k1.signAsync(..._prepareSignArgs(privKey, msg));
};

const syncFunctionList = { getFarmerKey, getAddress, getFingerPrint, getKeys };

export { getAddress, getFarmerKey, getFingerPrint, getKeys, sign, signAsync, syncFunctionList };
