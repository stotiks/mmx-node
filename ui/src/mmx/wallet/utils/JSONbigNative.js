const JSONbig = ({ storeAsString = false } = {}) => {
    const bigIntToRawJSON = (key, val) => {
        return typeof val === "bigint" ? JSON.rawJSON(String(val)) : val;
    };

    const rawJSONToBigInt = (key, val, { source }) => {
        if (typeof source === "string") {
            try {
                const bigInt = BigInt(source);
                if (bigInt > Number.MAX_SAFE_INTEGER || bigInt < Number.MIN_SAFE_INTEGER) {
                    if (storeAsString) {
                        return String(bigInt);
                    } else {
                        return bigInt;
                    }
                } else {
                    return Number.parseInt(bigInt);
                }
            } catch (e) {
                return val;
            }
        } else {
            return val;
        }
    };

    return {
        parse: (text) => JSON.parse(text, rawJSONToBigInt),
        stringify: (obj, replacer, ...args) => JSON.stringify(obj, bigIntToRawJSON, ...args),
    };
};

export const JSONbigNative = JSONbig();
export const JSONbigNativeString = JSONbig({ storeAsString: true });
