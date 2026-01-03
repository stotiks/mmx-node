import { utf8ToBytes } from "@noble/hashes/utils.js";

export const timingSafeEqual = (aBuf, bBuf) => {
    if (!Buffer.isBuffer(aBuf)) {
        throw new TypeError("First argument must be a buffer");
    }
    if (!Buffer.isBuffer(bBuf)) {
        throw new TypeError("Second argument must be a buffer");
    }
    if (aBuf.length !== bBuf.length) {
        throw new TypeError("Input buffers must have the same length");
    }
    let result = 0;
    for (let i = 0; i < aBuf.length; i++) {
        result |= aBuf[i] ^ bBuf[i];
    }

    return result === 0;
};

export const timingSafeEqualStr = (aStr, bStr) => {
    if (typeof aStr !== "string") {
        throw new TypeError("First argument must be a string");
    }
    if (typeof bStr !== "string") {
        throw new TypeError("Second argument must be a string");
    }
    return timingSafeEqual(Buffer.from(utf8ToBytes(aStr)), Buffer.from(utf8ToBytes(bStr)));
};
