export const cost_to_fee = (cost, feeRatio) => {
    const fee = (BigInt(cost) * BigInt(feeRatio)) / 1024n;
    return fee;
};

/**
 * Returns the smallest BigInt in the provided list.
 * Throws if no arguments are supplied.
 *
 * @param {...bigint} args
 * @returns {bigint}
 */
export const bigIntMin = (...args) => {
    if (args.length === 0) {
        throw new Error("bigIntMin requires at least one argument");
    }
    return args.reduce((min, e) => (e < min ? e : min));
};

/**
 * Returns the largest BigInt in the provided list.
 * Throws if no arguments are supplied.
 *
 * @param {...bigint} args
 * @returns {bigint}
 */
export const bigIntMax = (...args) => {
    if (args.length === 0) {
        throw new Error("bigIntMax requires at least one argument");
    }
    return args.reduce((max, e) => (e > max ? e : max));
};

import { Variant } from "./Variant";
export const get_num_bytes = (variant) => {
    if (!(variant instanceof Variant)) {
        throw new Error("Invalid type");
    }

    if (variant.valueOf() === null || typeof variant.valueOf() === "boolean") {
        return 1;
    } else if (typeof variant.valueOf() === "number" || typeof variant.valueOf() === "bigint") {
        return 8;
    } else if (typeof variant.valueOf() === "string") {
        return 4 + variant.valueOf().length;
    } else if (variant.valueOf() instanceof Array) {
        let total = 4;
        for (let entry of variant.valueOf()) {
            total += get_num_bytes(new Variant(entry));
        }
        return total;
    } else if (typeof variant.valueOf() === "object") {
        let total = 4;
        for (let [propertyName, value] of Object.entries(variant.valueOf())) {
            total += propertyName.length + get_num_bytes(new Variant(value));
        }
        return total;
    }
    return variant.size();
};
