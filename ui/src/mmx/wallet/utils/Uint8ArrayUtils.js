import { bytesToHex, abytes } from "@noble/hashes/utils.js";

/**
 * Split a 64-byte HMAC-SHA512 digest into two 32-byte halves.
 * @param {Uint8Array} digest - Must be exactly 64 bytes
 * @returns {{ first: Uint8Array, second: Uint8Array }}
 */
export const splitHmacDigest = (digest) => {
    abytes(digest, 64);
    return {
        first: digest.slice(0, 32),
        second: digest.slice(32, 64),
    };
};

/**
 * Convert a Uint8Array to uppercase hex string.
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export const toUpperHex = (bytes) => {
    return bytesToHex(bytes).toUpperCase();
};
