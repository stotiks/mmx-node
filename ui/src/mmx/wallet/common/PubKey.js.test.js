import { describe, it, expect } from "vitest";
import { PubKey } from "./PubKey.js";

describe("PubKey", () => {
    // Sample test data - 32 byte pubkey and 64 byte signature in hex
    const testPubKey = "0344EE96D1B85CAC0F99B7CFA44F39EFFC590BDF51D45099D1F24AA09E5F9AD6E0";
    const testSignature =
        "3D2D75E0DAA39933578855552D9629DB6A15FAE8C5539CC5DCE0F031349621433A78311E016044D8B4E98D775D7EB2947B977A076E3BB6058FC856CDE73EA0EB";

    describe("constructor", () => {
        it("should create a PubKey with provided pubkey and signature", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            expect(pubKey.__type).toBe("mmx.solution.PubKey");
            expect(pubKey.version).toBe(0);
            expect(pubKey.pubkey).toBe(testPubKey);
            expect(pubKey.signature).toBe(testSignature);
        });

        it("should create a PubKey with empty strings", () => {
            const pubKey = new PubKey({
                pubkey: "",
                signature: "",
            });

            expect(pubKey.pubkey).toBe("");
            expect(pubKey.signature).toBe("");
        });

        it("should handle Uint8Array inputs", () => {
            const pubKeyBytes = new Uint8Array(33);
            const signatureBytes = new Uint8Array(64);

            const pubKey = new PubKey({
                pubkey: pubKeyBytes,
                signature: signatureBytes,
            });

            expect(pubKey.pubkey).toBeDefined();
            expect(pubKey.signature).toBeDefined();
        });
    });

    describe("getHashProxy", () => {
        it("should return a proxy that converts pubkey to bytes_t", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const proxy = pubKey.getHashProxy();
            expect(proxy.pubkey).toBeDefined();
            expect(proxy.pubkey.constructor.name).toBe("bytes_t");
        });

        it("should return a proxy that converts signature to bytes_t", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const proxy = pubKey.getHashProxy();
            expect(proxy.signature).toBeDefined();
            expect(proxy.signature.constructor.name).toBe("bytes_t");
        });

        it("should preserve version in proxy", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const proxy = pubKey.getHashProxy();
            expect(proxy.version).toBe(0);
        });

        it("should preserve __type in proxy", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const proxy = pubKey.getHashProxy();
            expect(proxy.__type).toBe("mmx.solution.PubKey");
        });
    });

    describe("hash_serialize", () => {
        it("should serialize to a buffer", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const serialized = pubKey.hash_serialize(false);
            expect(serialized).toBeDefined();
            expect(serialized.byteLength).toBeGreaterThan(0);
        });

        it("should produce consistent output for same inputs", () => {
            const pubKey1 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const pubKey2 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const serialized1 = pubKey1.hash_serialize(false);
            const serialized2 = pubKey2.hash_serialize(false);

            expect(new Uint8Array(serialized1)).toEqual(new Uint8Array(serialized2));
        });

        it("should produce different output for different pubkeys", () => {
            const pubKey1 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const pubKey2 = new PubKey({
                pubkey: "022C514E47B3C5015D4118F4FF7E38041431358D4B16CB9654C1ABD28D8E1FD8DC",
                signature: testSignature,
            });

            const serialized1 = pubKey1.hash_serialize(false);
            const serialized2 = pubKey2.hash_serialize(false);

            expect(new Uint8Array(serialized1)).not.toEqual(new Uint8Array(serialized2));
        });

        it("should include type hash in serialization", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const serialized = pubKey.hash_serialize(false);
            // Type hash is written first as BigInt, should be present
            expect(serialized.byteLength).toBeGreaterThan(8);
        });
    });

    describe("calc_hash", () => {
        it("should calculate a hash from serialized data", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const hash = pubKey.calc_hash(false);
            expect(hash).toBeDefined();
            expect(typeof hash).toBe("object");
            expect(hash.constructor.name).toBe("hash_t");
        });

        it("should produce consistent hashes for same inputs", () => {
            const pubKey1 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const pubKey2 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const hash1 = pubKey1.calc_hash(false);
            const hash2 = pubKey2.calc_hash(false);

            expect(hash1.toString()).toBe(hash2.toString());
        });

        it("should produce different hashes for different signatures", () => {
            const pubKey1 = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const pubKey2 = new PubKey({
                pubkey: testPubKey,
                signature:
                    "024F512B1F7149662F2D7B1901A2B1A392971091263A40E6DFE415314322EDD321CFE68AA81CDAAA854EA15F5BB9891F38A37F6CDADEFA6153F8613F7B133415",
            });

            const hash1 = pubKey1.calc_hash(false);
            const hash2 = pubKey2.calc_hash(false);

            expect(hash1.toString()).not.toBe(hash2.toString());
        });

        it("should handle full_hash parameter", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const hashFull = pubKey.calc_hash(true);
            const hashNotFull = pubKey.calc_hash(false);

            expect(hashFull).toBeDefined();
            expect(hashNotFull).toBeDefined();
            // Both should produce valid hashes
            expect(typeof hashFull).toBe("object");
            expect(typeof hashNotFull).toBe("object");
        });
    });

    describe("calc_cost", () => {
        it("should calculate cost based on params", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const params = {
                min_txfee_sign: 1000,
            };

            const cost = pubKey.calc_cost(params);
            expect(cost).toBe(1000n);
            expect(typeof cost).toBe("bigint");
        });

        it("should return different costs for different params", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const params1 = { min_txfee_sign: 1000 };
            const params2 = { min_txfee_sign: 2000 };

            const cost1 = pubKey.calc_cost(params1);
            const cost2 = pubKey.calc_cost(params2);

            expect(cost1).toBe(1000n);
            expect(cost2).toBe(2000n);
        });

        it("should handle BigInt min_txfee_sign", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const params = {
                min_txfee_sign: 5000n,
            };

            const cost = pubKey.calc_cost(params);
            expect(cost).toBe(5000n);
        });

        it("should handle zero cost", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const params = {
                min_txfee_sign: 0,
            };

            const cost = pubKey.calc_cost(params);
            expect(cost).toBe(0n);
        });
    });

    describe("edge cases", () => {
        it("should handle empty pubkey and signature in hash operations", () => {
            const pubKey = new PubKey({
                pubkey: "",
                signature: "",
            });

            expect(() => {
                pubKey.hash_serialize(false);
            }).not.toThrow();

            expect(() => {
                pubKey.calc_hash(false);
            }).not.toThrow();
        });

        it("should handle long hex strings", () => {
            const longPubKey = "0".repeat(66); // 33 bytes
            const longSignature = "0".repeat(128); // 64 bytes

            const pubKey = new PubKey({
                pubkey: longPubKey,
                signature: longSignature,
            });

            expect(pubKey.pubkey).toBe(longPubKey);
            expect(pubKey.signature).toBe(longSignature);
        });

        it("should maintain immutability through proxy", () => {
            const pubKey = new PubKey({
                pubkey: testPubKey,
                signature: testSignature,
            });

            const proxy = pubKey.getHashProxy();
            const originalPubkey = pubKey.pubkey;

            // Accessing through proxy should not modify original
            proxy.pubkey;
            expect(pubKey.pubkey).toBe(originalPubkey);
        });
    });
});
