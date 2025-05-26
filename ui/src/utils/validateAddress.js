import { bech32m } from "@scure/base";

export const validateAddress = (address) => {
    try {
        const { prefix, words } = bech32m.decode(address);
        if (prefix !== "mmx") {
            // invalid HRP
            return false;
        }
        if (words.length != 52) {
            // (size != 52)
            return false;
        }
    } catch (e) {
        // invalid address
        return false;
    }
    return true;
};
