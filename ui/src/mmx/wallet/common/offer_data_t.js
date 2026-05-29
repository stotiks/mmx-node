import { isUInt128, uint128 } from "./uint128";

export const get_price = (inv_price) => {
    if (!isUInt128(inv_price)) {
        throw new TypeError("inv_price must be uint128");
    }
    const inv = BigInt(inv_price);
    if (inv === 0n) throw new Error("inv_price cannot be zero");
    const scaled = (1n << (64n + 53n)) / inv;
    return Number(scaled) / Math.pow(2, 53);
};

export const get_inv_price = (bid_amount, ask_amount) => {
    if (!(typeof bid_amount === "number" && Number.isFinite(bid_amount) && bid_amount > 0)) {
        throw new TypeError("bid_amount must be a positive finite number");
    }
    if (!(typeof ask_amount === "number" && Number.isFinite(ask_amount) && ask_amount > 0)) {
        throw new TypeError("ask_amount must be a positive finite number");
    }

    const inv = BigInt(Math.round(bid_amount * Math.pow(2, 64))) / BigInt(ask_amount);
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

export const get_inv_price_with_decimals = (displayPrice, bidDecimals, askDecimals) => {
    if (!(typeof displayPrice === "number" && Number.isFinite(displayPrice) && displayPrice > 0)) {
        throw new TypeError("displayPrice must be a positive finite number");
    }
    if (!Number.isInteger(bidDecimals) || !Number.isInteger(askDecimals)) {
        throw new TypeError("decimals must be integers");
    }

    const decimalDiff = bidDecimals - askDecimals;

    // Scale displayPrice to avoid float issues
    const priceScaled = BigInt(Math.round(displayPrice * Math.pow(2, 53)));
    const baseInvPrice = 1n << (64n + 53n);

    let invPrice;
    if (decimalDiff >= 0) {
        const multiplier = BigInt(10 ** decimalDiff);
        invPrice = (baseInvPrice * multiplier) / priceScaled;
    } else {
        const divisor = BigInt(10 ** -decimalDiff);
        invPrice = baseInvPrice / (priceScaled * divisor);
    }

    return new uint128(invPrice);
};
