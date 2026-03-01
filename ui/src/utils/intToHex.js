export const intToHex = (int) => {
    const bigInt = BigInt(int);
    let hex;

    if (bigInt < 0n) {
        // For negative numbers, use two's complement representation (256-bit)
        const mask = (1n << 256n) - 1n;
        hex = (bigInt & mask).toString(16);
    } else {
        hex = bigInt.toString(16);
    }

    if (hex.length % 2) {
        hex = "0" + hex; // Ensure even length
    }
    return "0x" + hex;
};
