import { truncateMiddle } from "./truncateMiddle.js";

export const getShortAddr = (hash, length) => {
    if (!length) {
        length = 10;
    }
    return truncateMiddle(hash, length, length);
};
