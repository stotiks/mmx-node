import { isUInt128, uint128 } from "./uint128";

export const get_price = (inv_price) => {
    if (!isUInt128(inv_price)) {
        throw new TypeError("inv_price must be uint128");
    }
    return 2 ** 64 / Number(inv_price);
};

export const get_inv_price = (price) => {
    if (!(typeof price === "number" && Number.isFinite(price) && price > 0)) {
        throw new TypeError("price must be a positive finite number");
    }
    const inv = 2 ** 64 / price;
    return new uint128(inv);
};

export const get_bid_amount = (ask_amount, inv_price) => {
    if (!isUInt128(ask_amount) || !isUInt128(inv_price)) {
        throw new TypeError("Inputs must be uint128");
    }

    const _bid_amount = (ask_amount * inv_price) >> 64n;
    const bid_amount = new uint128(_bid_amount);

    if (bid_amount.upper()) {
        throw new Error("get_bid_amount(): bid amount overflow");
    }

    return bid_amount;
};

export const get_ask_amount = (bid_amount, inv_price) => {
    if (!isUInt128(bid_amount) || !isUInt128(inv_price)) {
        throw new TypeError("Inputs must be uint128");
    }

    const _ask_amount = ((bid_amount << 64n) + inv_price - 1n) / inv_price;
    const ask_amount = new uint128(_ask_amount);

    if (ask_amount.upper()) {
        throw new Error("get_ask_amount(): ask amount overflow");
    }

    return ask_amount;
};
