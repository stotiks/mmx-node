import { validateAddress } from "./validateAddress";

/**
 * Centralized JSON stringification utility
 * @param {any} value - The value to stringify
 * @param {number} indent - Number of spaces for indentation (default: 4)
 * @returns {string} - Formatted JSON string or original value if not an object
 */
export const stringify = (value, indent = 4) => {
    if (value instanceof Object) {
        try {
            return JSON.stringify(value, null, indent);
        } catch (error) {
            console.warn("Failed to stringify object:", error);
            return String(value);
        }
    }
    return String(value);
};

/**
 * Check if a string is a valid MMX address
 * @param {any} value - The value to check
 * @returns {boolean} - True if valid MMX address
 */
export const isMMXAddress = (value) => {
    if (typeof value !== "string") return false;

    // Quick format check before expensive validation
    if (!value.startsWith("mmx1") || value.length !== 62) {
        return false;
    }

    return validateAddress(value);
};

/**
 * Enhanced hex string detection
 * @param {any} value - The value to check
 * @param {number} minLength - Minimum length for hex string (default: 68)
 * @returns {boolean} - True if valid hex string
 */
export const isHexString = (value, minLength = 68) => {
    if (typeof value !== "string" || !value) return false;

    // Check length and even number of characters
    if (value.length < minLength || value.length % 2 !== 0) {
        return false;
    }

    // Check if all characters are valid hex
    return /^[0-9a-fA-F]+$/.test(value);
};

/**
 * Smart object formatting for display
 * @param {any} value - The value to format
 * @returns {object} - Formatted object with type information
 */
export const formatObjectForDisplay = (value) => {
    const result = {
        value,
        type: "unknown",
        displayValue: String(value),
        isExpandable: false,
        isClickable: false,
    };

    if (value === null || value === undefined) {
        result.type = "null";
        result.displayValue = "null";
        return result;
    }

    if (typeof value === "string") {
        if (isMMXAddress(value)) {
            result.type = "address";
            result.isClickable = true;
        } else if (isHexString(value)) {
            result.type = "hex";
            result.isExpandable = true;
        } else {
            result.type = "string";
        }
        return result;
    }

    if (typeof value === "object") {
        result.type = "object";
        result.isExpandable = Object.keys(value).length > 0;
        result.displayValue = stringify(value);
        return result;
    }

    if (typeof value === "number") {
        result.type = "number";
        return result;
    }

    if (typeof value === "boolean") {
        result.type = "boolean";
        return result;
    }

    return result;
};

/**
 * Check if a value should be expandable in the object table
 * @param {any} value - The value to check
 * @param {string} key - The key name (for special cases like 'source')
 * @returns {boolean} - True if expandable
 */
export const isExpandable = (value, key) => {
    // Special case for 'source' key
    if (key === "source") return true;

    // Objects with content are expandable
    if (value instanceof Object && Object.keys(value).length > 0) {
        return true;
    }

    // Hex strings are expandable
    if (typeof value === "string" && isHexString(value)) {
        return true;
    }

    return false;
};
