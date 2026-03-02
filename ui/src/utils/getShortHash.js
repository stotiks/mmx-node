import { truncateMiddle } from "./truncateMiddle.js";

export const getShortHash = (hash, length) => {
    if (!length) {
        length = 10;
    }
    return truncateMiddle(hash, length, length);
};
