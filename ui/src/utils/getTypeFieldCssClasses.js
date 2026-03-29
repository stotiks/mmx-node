/**
 * Maps a transaction type to its corresponding Quasar CSS text color class.
 *
 * @param {string} type - The transaction type identifier (e.g., "REWARD", "SPEND").
 * @returns {string} The CSS class string, or empty string if type is unrecognized.
 */

const TYPE_CLASS_MAP = Object.freeze({
    REWARD: "text-lime-8",
    RECEIVE: "text-positive",
    VDF_REWARD: "text-positive",
    SPEND: "text-negative",
    TXFEE: "text-grey",
});

export const getTypeFieldCssClasses = (type) => {
    return TYPE_CLASS_MAP[type] ?? "";
};
