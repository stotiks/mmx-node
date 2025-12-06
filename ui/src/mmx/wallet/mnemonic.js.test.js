import { assert, describe, expect, it, vi } from "vitest";
import { mnemonicToSeed, seedToWords, randomWords, randomSeed } from "./mnemonic";

import "./utils/Uint8ArrayUtils";
import { hash_t } from "./common/addr_t";
import { wordlist as wordlistEnglish } from "@scure/bip39/wordlists/english.js";

import * as nobleUtils from "@noble/hashes/utils.js";
vi.mock("@noble/hashes/utils.js", { spy: true });

const mnemonic =
    "apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple apple anchor";
const hashStr = "A84215AA50852A54A10A55A84215AA50852A54A10A55A84215AA50852A54A10A";
const seed = nobleUtils.hexToBytes(hashStr);

describe("mnemonic #1", async () => {
    it("mnemonicToSeed", () => {
        const seed2 = mnemonicToSeed(mnemonic);
        assert.deepEqual(seed2, seed);

        const seed3 = mnemonicToSeed(mnemonic, wordlistEnglish);
        assert.deepEqual(seed3, seed);
    });

    it("seedToWords", () => {
        const words = seedToWords(seed);
        assert.equal(words, mnemonic);
    });
});

describe("mnemonic #2", async () => {
    const mnemonic =
        "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";
    const seed = new hash_t();

    it("mnemonicToSeed", () => {
        const seed2 = mnemonicToSeed(mnemonic);
        assert.deepEqual(seed2, seed);
    });

    it("seedToWords", () => {
        const mnemonic2 = seedToWords(seed);
        assert.equal(mnemonic2, mnemonic);
    });
});

describe("mnemonic #3", async () => {
    vi.mocked(nobleUtils.randomBytes).mockReturnValue(seed);

    it("randomSeed", () => {
        const seed2 = randomSeed();
        assert.deepEqual(seed2, seed);
    });

    it("randomWords", () => {
        const mnemonic2 = randomWords();
        assert.equal(mnemonic2, mnemonic);

        const mnemonic3 = randomWords(wordlistEnglish);
        assert.equal(mnemonic3, mnemonic);
    });
});
