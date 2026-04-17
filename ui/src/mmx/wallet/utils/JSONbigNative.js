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

/**
 * Deeply clone a value, converting BigInts to a JSON-safe form that mirrors
 * `JSONbigNativeString.parse(JSONbigNative.stringify(x))`:
 *
 * - BigInt within ±Number.MAX_SAFE_INTEGER → regular Number
 * - BigInt outside that range → String (preserves precision)
 *
 * Nested objects exposing a `toJSON()` method are honored (matching
 * `JSON.stringify` semantics), so classes that customize their JSON form
 * (e.g. `Deposit`, which stringifies its `amount`) produce identical output.
 *
 * The top-level `value` is NOT dispatched through its own `toJSON()`. This
 * allows callers to do `bigIntToJsonSafe(this)` from inside their own `toJSON`
 * implementation without recursing infinitely, while still having `toJSON`
 * applied to every nested child (which is the common case — matching what
 * `JSON.stringify` does when it calls a root `toJSON()` and then recurses
 * into the returned value).
 */
export const bigIntToJsonSafe = (value) => _bigIntToJsonSafe(value, true);

const _bigIntToJsonSafe = (value, isRoot) => {
    if (typeof value === "bigint") {
        return value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER ? value.toString() : Number(value);
    }
    if (value === null || typeof value !== "object") return value;

    // Respect `toJSON()` like native JSON.stringify does, but skip it for the
    // top-level value so callers can safely pass `this` from their own toJSON.
    if (!isRoot && typeof value.toJSON === "function") {
        return _bigIntToJsonSafe(value.toJSON(), false);
    }

    if (Array.isArray(value)) return value.map((v) => _bigIntToJsonSafe(v, false));

    const out = {};
    for (const key of Object.keys(value)) {
        out[key] = _bigIntToJsonSafe(value[key], false);
    }
    return out;
};
