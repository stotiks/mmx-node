import { u8 } from "@noble/hashes/utils";

/**
 * Concatenate an existing buffer with an array of chunks
 *
 * @param {Uint8Array[]} chunks  New chunks produced since last flush.
 * @param {Uint8Array}   baseBuf Previously flushed buffer.
 * @returns {Uint8Array} New contiguous buffer.
 */
const concatUint8Arrays = (chunks, baseBuf) => {
    // Compute exact result length
    let totalLength = baseBuf.byteLength;
    for (const c of chunks) totalLength += c.byteLength;

    // Allocate once
    const result = new Uint8Array(totalLength);

    // Copy existing buffer first
    result.set(baseBuf, 0);

    // Copy chunks sequentially
    let offset = baseBuf.byteLength;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return result;
};

export class WriteBuffer {
    #chunks = [];
    #buffer = new Uint8Array([]);
    get buffer() {
        this.flush();
        return this.#buffer;
    }

    flush() {
        if (this.#chunks.length > 0) {
            this.#buffer = concatUint8Arrays(this.#chunks, this.#buffer);
            this.#chunks = [];
        }
    }

    write(buffer) {
        this.#chunks.push(u8(buffer));
    }
}
