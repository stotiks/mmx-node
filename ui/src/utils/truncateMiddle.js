/**
 * Truncates a string in the middle, showing the beginning and end with ellipsis.
 *
 * @param {string} str - The string to truncate
 * @param {number} frontChars - Number of characters to show at the beginning (default: 10)
 * @param {number} endChars - Number of characters to show at the end (default: 10)
 * @returns {string} The truncated string with ellipsis in the middle
 */
export const truncateMiddle = (str, frontChars = 10, endChars = 10) => {
    if (!str || str.length <= frontChars + endChars) {
        return str;
    }
    return str.substring(0, frontChars) + "..." + str.substring(str.length - endChars);
};
