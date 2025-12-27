import { describe, it, expect, assert } from "vitest";
import { PubKey } from "./PubKey.js";
import { bytes_t, hash_t } from "./addr_t.js";

import "../utils/Uint8ArrayUtils.js";

describe("PubKey", () => {
    const validPubKey = "0344EE96D1B85CAC0F99B7CFA44F39EFFC590BDF51D45099D1F24AA09E5F9AD6E0";
    const validSignature =
        "3D2D75E0DAA39933578855552D9629DB6A15FAE8C5539CC5DCE0F031349621433A78311E016044D8B4E98D775D7EB2947B977A076E3BB6058FC856CDE73EA0EB";

    describe("Constructor", () => {
        it("should create PubKey with valid parameters", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            expect(pubKey.version).toBe(0);
            expect(pubKey.pubkey).toBe(validPubKey);
            expect(pubKey.signature).toBe(validSignature);
            expect(pubKey.__type).toBe("mmx.solution.PubKey");
        });

        it("should create PubKey with empty parameters", () => {
            const pubKey = new PubKey({
                pubkey: "",
                signature: "",
            });

            expect(pubKey.version).toBe(0);
            expect(pubKey.pubkey).toBe("");
            expect(pubKey.signature).toBe("");
        });

        it("should handle undefined parameters", () => {
            const pubKey = new PubKey({
                pubkey: undefined,
                signature: undefined,
            });

            expect(pubKey.pubkey).toBeUndefined();
            expect(pubKey.signature).toBeUndefined();
        });
    });

    describe("Hash Proxy", () => {
        it("should create hash proxy correctly", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const proxy = pubKey.getHashProxy();

            expect(proxy.version).toBe(0);
            expect(proxy.pubkey).toBeInstanceOf(bytes_t);
            expect(proxy.signature).toBeInstanceOf(bytes_t);
            expect(proxy.__type).toBe("mmx.solution.PubKey");
        });

        it("should convert pubkey to bytes_t in proxy", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const proxy = pubKey.getHashProxy();

            expect(proxy.pubkey.toString()).toBe(validPubKey);
            expect(proxy.pubkey).toBeInstanceOf(bytes_t);
        });

        it("should convert signature to bytes_t in proxy", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const proxy = pubKey.getHashProxy();

            expect(proxy.signature.toString()).toBe(validSignature);
            expect(proxy.signature).toBeInstanceOf(bytes_t);
        });

        it("should handle empty strings in proxy", () => {
            const pubKey = new PubKey({
                pubkey: "",
                signature: "",
            });

            const proxy = pubKey.getHashProxy();

            expect(proxy.pubkey).toBeInstanceOf(bytes_t);
            expect(proxy.signature).toBeInstanceOf(bytes_t);
            expect(proxy.pubkey.toString()).toBe("");
            expect(proxy.signature.toString()).toBe("");
        });

        it("should pass through non-converted properties", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const proxy = pubKey.getHashProxy();

            expect(proxy.version).toBe(pubKey.version);
            expect(proxy.__type).toBe(pubKey.__type);
        });
    });

    describe("Hash Serialization", () => {
        it("should serialize hash correctly", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const serialized = pubKey.hash_serialize(true);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });

        it("should serialize with empty values", () => {
            const pubKey = new PubKey({
                pubkey: "",
                signature: "",
            });

            const serialized = pubKey.hash_serialize(true);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });

        it("should handle full_hash parameter", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const serializedFull = pubKey.hash_serialize(true);
            const serializedPartial = pubKey.hash_serialize(false);

            expect(serializedFull).toBeInstanceOf(Uint8Array);
            expect(serializedPartial).toBeInstanceOf(Uint8Array);
            // Both should be the same for PubKey as it doesn't use full_hash parameter
            expect(serializedFull.length).toBe(serializedPartial.length);
        });
    });

    describe("Hash Calculation", () => {
        it("should calculate hash correctly", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const hash = pubKey.calc_hash(true);

            expect(hash).toBeInstanceOf(Uint8Array);
            expect(hash.length).toBe(32); // SHA256 hash length
        });

        it("should produce consistent hashes", () => {
            const pubKey1 = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const pubKey2 = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const hash1 = pubKey1.calc_hash(true);
            const hash2 = pubKey2.calc_hash(true);

            expect(hash1.toHex()).toBe(hash2.toHex());
        });

        it("should produce different hashes for different data", () => {
            const pubKey1 = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const differentSignature = "4D2D75E0DAA39933578855552D9629DB6A15FAE8C5539CC5DCE0F031349621433A78311E016044D8B4E98D775D7EB2947B977A076E3BB6058FC856CDE73EA0EB";
            const pubKey2 = new PubKey({
                pubkey: validPubKey,
                signature: differentSignature,
            });

            const hash1 = pubKey1.calc_hash(true);
            const hash2 = pubKey2.calc_hash(true);

            expect(hash1.toHex()).not.toBe(hash2.toHex());
        });

        it("should handle full_hash parameter in calc_hash", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const hashFull = pubKey.calc_hash(true);
            const hashPartial = pubKey.calc_hash(false);

            expect(hashFull).toBeInstanceOf(Uint8Array);
            expect(hashPartial).toBeInstanceOf(Uint8Array);
            expect(hashFull.length).toBe(32);
            expect(hashPartial.length).toBe(32);
        });
    });

    describe("Cost Calculation", () => {
        it("should calculate cost correctly", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const mockParams = {
                min_txfee_sign: 1000,
            };

            const cost = pubKey.calc_cost(mockParams);

            expect(cost).toBe(BigInt(1000));
        });

        it("should handle different fee parameters", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const mockParams1 = { min_txfee_sign: 500 };
            const mockParams2 = { min_txfee_sign: 2000 };

            const cost1 = pubKey.calc_cost(mockParams1);
            const cost2 = pubKey.calc_cost(mockParams2);

            expect(cost1).toBe(500n);
            expect(cost2).toBe(2000n);
        });

        it("should handle zero fee", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const mockParams = { min_txfee_sign: 0 };
            const cost = pubKey.calc_cost(mockParams);

            expect(cost).toBe(0n);
        });

        it("should handle large fee values", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const mockParams = { min_txfee_sign: Number.MAX_SAFE_INTEGER };
            const cost = pubKey.calc_cost(mockParams);

            expect(cost).toBe(BigInt(Number.MAX_SAFE_INTEGER));
        });
    });

    describe("Edge Cases", () => {
        it("should handle hex strings without 0x prefix", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            expect(pubKey.pubkey).toBe(validPubKey);
            expect(pubKey.signature).toBe(validSignature);

            // Should work with hash operations
            const hash = pubKey.calc_hash(true);
            expect(hash).toBeInstanceOf(Uint8Array);
            expect(hash.length).toBe(32);
        });

        it("should handle lowercase hex strings", () => {
            const pubKeyLower = validPubKey.toLowerCase();
            const signatureLower = validSignature.toLowerCase();

            const pubKey = new PubKey({
                pubkey: pubKeyLower,
                signature: signatureLower,
            });

            expect(pubKey.pubkey).toBe(pubKeyLower);
            expect(pubKey.signature).toBe(signatureLower);

            const hash = pubKey.calc_hash(true);
            expect(hash).toBeInstanceOf(Uint8Array);
        });

        it("should handle very short hex strings", () => {
            const pubKey = new PubKey({
                pubkey: "AB",
                signature: "CD",
            });

            const hash = pubKey.calc_hash(true);
            expect(hash).toBeInstanceOf(Uint8Array);
            expect(hash.length).toBe(32);
        });

        it("should handle very long hex strings", () => {
            const longHex = "A".repeat(1000);

            const pubKey = new PubKey({
                pubkey: longHex,
                signature: longHex,
            });

            const hash = pubKey.calc_hash(true);
            expect(hash).toBeInstanceOf(Uint8Array);
            expect(hash.length).toBe(32);
        });
    });

    describe("Type Validation", () => {
        it("should maintain correct type", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            expect(pubKey.__type).toBe("mmx.solution.PubKey");
        });

        it("should have correct version", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            expect(pubKey.version).toBe(0);
        });
    });

    describe("Integration with bytes_t", () => {
        it("should work with bytes_t input", () => {
            const pubKeyBytes = new bytes_t(validPubKey);
            const signatureBytes = new bytes_t(validSignature);

            const pubKey = new PubKey({
                pubkey: pubKeyBytes.toString(),
                signature: signatureBytes.toString(),
            });

            expect(pubKey.pubkey).toBe(validPubKey);
            expect(pubKey.signature).toBe(validSignature);
        });

        it("should produce valid bytes_t in proxy", () => {
            const pubKey = new PubKey({
                pubkey: validPubKey,
                signature: validSignature,
            });

            const proxy = pubKey.getHashProxy();

            // Should be able to get hex representation
            expect(typeof proxy.pubkey.toString()).toBe("string");
            expect(typeof proxy.signature.toString()).toBe("string");

            // Should be able to get byte array
            expect(proxy.pubkey.valueOf()).toBeInstanceOf(Uint8Array);
            expect(proxy.signature.valueOf()).toBeInstanceOf(Uint8Array);
        });
    });
});
