import { truncateMiddle } from "./truncateMiddle.js";

/**
 * @deprecated Use truncateMiddle instead
 */
export const getShortAddr = (hash, length) => {
    if (!length) {
        length = 10;
    }
    return truncateMiddle(hash, length, length);
};
