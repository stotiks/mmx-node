/**
 * JSON serialization/deserialization with native BigInt support.
 * Uses JSON.rawJSON (stage 3 proposal, widely supported) to preserve
 * large integer precision that would be lost with standard JSON.parse.
 *
 * Numbers outside the safe integer range (±2^53-1) are stored as:
 * - BigInt (default, JSONbigNative)
 * - String (with storeAsString: true, JSONbigNativeString)
 */

// Shared replacer: converts BigInt → raw JSON numeric literal on stringify
const bigIntReplacer = (_key, val) => (typeof val === "bigint" ? JSON.rawJSON(String(val)) : val);

// Integer-only pattern: optional sign, one or more digits, no decimal/exponent
const INTEGER_RE = /^-?\d+$/;

const createReviver =
    (storeAsString) =>
    (_key, val, { source }) => {
        // Only attempt BigInt conversion for raw source strings that look like integers
        if (typeof source !== "string" || !INTEGER_RE.test(source)) return val;

        try {
            const big = BigInt(source);

            if (big > Number.MAX_SAFE_INTEGER || big < Number.MIN_SAFE_INTEGER) {
                return storeAsString ? source : big;
            }

            return Number(big);
        } catch {
            return val;
        }
    };

const createJSONbig = (storeAsString = false) => {
    const reviver = createReviver(storeAsString);

    return {
        parse: (text) => JSON.parse(text, reviver),
        stringify: (obj, _replacer, ...args) => JSON.stringify(obj, bigIntReplacer, ...args),
    };
};

export const JSONbigNative = createJSONbig();
export const JSONbigNativeString = createJSONbig(true);
