import { describe, it, expect } from "vitest";
import { exec_result_t } from "./exec_result_t.js";
import { txin_t, txout_t } from "./txio_t.js";
import { ChainParams } from "../utils/ChainParams.js";

describe("exec_result_t", () => {
    const validAddress = "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev";
    const validContract = "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6";

    describe("constructor", () => {
        it("should create exec_result_t with default values", () => {
            const result = new exec_result_t();

            expect(result.__type).toBe("mmx.exec_result_t");
            expect(result.did_fail).toBeUndefined();
            expect(result.total_cost).toBeUndefined();
            expect(result.total_fee).toBeUndefined();
            expect(result.inputs).toBeUndefined();
            expect(result.outputs).toBeUndefined();
            expect(result.error).toBeUndefined();
        });

        it("should create exec_result_t with provided values", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
                outputs: [
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 90,
                    },
                ],
                error: null,
            });

            expect(result.did_fail).toBe(false);
            expect(result.total_cost).toBe(10000);
            expect(result.total_fee).toBe(1000);
            expect(result.inputs).toHaveLength(1);
            expect(result.outputs).toHaveLength(1);
            expect(result.error).toBe(null);
        });

        it("should handle failure state with error", () => {
            const errorMsg = "Contract execution failed";
            const result = new exec_result_t({
                did_fail: true,
                total_cost: 5000,
                total_fee: 500,
                inputs: [],
                outputs: [],
                error: errorMsg,
            });

            expect(result.did_fail).toBe(true);
            expect(result.error).toBe(errorMsg);
        });
    });

    describe("getHashProxy", () => {
        it("should convert inputs to txin_t array", () => {
            const result = new exec_result_t({
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
            });

            const proxy = result.getHashProxy();
            expect(proxy.inputs).toBeDefined();
            expect(Array.isArray(proxy.inputs)).toBe(true);
            expect(proxy.inputs[0].constructor.name).toBe("txin_t");
        });

        it("should convert outputs to txout_t array", () => {
            const result = new exec_result_t({
                outputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
            });

            const proxy = result.getHashProxy();
            expect(proxy.outputs).toBeDefined();
            expect(Array.isArray(proxy.outputs)).toBe(true);
            expect(proxy.outputs[0].constructor.name).toBe("txout_t");
        });

        it("should wrap error in optional", () => {
            const result = new exec_result_t({
                error: "Test error",
            });

            const proxy = result.getHashProxy();
            expect(proxy.error).toBeDefined();
            expect(proxy.error.constructor.name).toBe("optional");
        });

        it("should handle null error", () => {
            const result = new exec_result_t({
                error: null,
            });

            const proxy = result.getHashProxy();
            expect(proxy.error).toBeDefined();
            expect(proxy.error.constructor.name).toBe("optional");
        });

        it("should handle empty inputs and outputs", () => {
            const result = new exec_result_t({
                inputs: [],
                outputs: [],
            });

            const proxy = result.getHashProxy();
            expect(proxy.inputs).toEqual([]);
            expect(proxy.outputs).toEqual([]);
        });

        it("should preserve other properties", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
            });

            const proxy = result.getHashProxy();
            expect(proxy.did_fail).toBe(false);
            expect(proxy.total_cost).toBe(10000);
            expect(proxy.total_fee).toBe(1000);
        });
    });

    describe("hash_serialize", () => {
        it("should serialize to buffer", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [],
                outputs: [],
                error: null,
            });

            const serialized = result.hash_serialize(false);
            expect(serialized).toBeDefined();
            expect(serialized.byteLength).toBeGreaterThan(0);
        });

        it("should produce consistent output for same inputs", () => {
            const params = {
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [],
                outputs: [],
                error: null,
            };

            const result1 = new exec_result_t(params);
            const result2 = new exec_result_t(params);

            const serialized1 = result1.hash_serialize(false);
            const serialized2 = result2.hash_serialize(false);

            expect(new Uint8Array(serialized1)).toEqual(new Uint8Array(serialized2));
        });

        it("should include type hash in serialization", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 0,
                total_fee: 0,
                inputs: [],
                outputs: [],
                error: null,
            });

            const serialized = result.hash_serialize(false);
            // Type hash is written first as BigInt (8 bytes)
            expect(serialized.byteLength).toBeGreaterThan(8);
        });

        it("should serialize with inputs and outputs", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
                outputs: [
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 90,
                    },
                ],
                error: null,
            });

            const serialized = result.hash_serialize(false);
            expect(serialized.byteLength).toBeGreaterThan(100); // Should be larger with data
        });
    });

    describe("calc_hash", () => {
        it("should calculate hash from serialized data", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [],
                outputs: [],
                error: null,
            });

            const hash = result.calc_hash(false);
            expect(hash).toBeDefined();
            expect(typeof hash).toBe("object");
            expect(hash.constructor.name).toBe("hash_t");
        });

        it("should produce consistent hashes for same inputs", () => {
            const params = {
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [],
                outputs: [],
                error: null,
            };

            const result1 = new exec_result_t(params);
            const result2 = new exec_result_t(params);

            const hash1 = result1.calc_hash(false);
            const hash2 = result2.calc_hash(false);

            expect(hash1.toString()).toBe(hash2.toString());
        });

        it("should produce different hashes for different states", () => {
            const result1 = new exec_result_t({
                did_fail: false,
                total_cost: 10000,
                total_fee: 1000,
                inputs: [],
                outputs: [],
                error: null,
            });

            const result2 = new exec_result_t({
                did_fail: true,
                total_cost: 5000,
                total_fee: 500,
                inputs: [],
                outputs: [],
                error: null, // Error needs to be object with calc_hash() or null
            });

            const hash1 = result1.calc_hash(false);
            const hash2 = result2.calc_hash(false);

            expect(hash1.toString()).not.toBe(hash2.toString());
        });
    });

    describe("calc_cost", () => {
        const params = new ChainParams({
            min_txfee_io: 100,
            min_txfee_memo: 50,
        });

        it("should calculate cost with no inputs/outputs", () => {
            const result = new exec_result_t({
                inputs: [],
                outputs: [],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBe(0n);
            expect(typeof cost).toBe("bigint");
        });

        it("should calculate cost with inputs", () => {
            const result = new exec_result_t({
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
                outputs: [],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBeGreaterThan(0n);
        });

        it("should calculate cost with outputs", () => {
            const result = new exec_result_t({
                inputs: [],
                outputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBeGreaterThan(0n);
        });

        it("should calculate cost with both inputs and outputs", () => {
            const result = new exec_result_t({
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                ],
                outputs: [
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 90,
                    },
                ],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBeGreaterThan(0n);
            // Cost should be sum of input and output costs
            expect(cost).toBe(200n); // 2 * min_txfee_io
        });

        it("should calculate cost with memo", () => {
            const result = new exec_result_t({
                inputs: [],
                outputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                        memo: "test memo",
                    },
                ],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBeGreaterThan(100n); // Should include memo cost
        });

        it("should handle multiple inputs and outputs", () => {
            const result = new exec_result_t({
                inputs: [
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 100,
                    },
                    {
                        address: validAddress,
                        contract: validContract,
                        amount: 200,
                    },
                ],
                outputs: [
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 90,
                    },
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 180,
                    },
                    {
                        address: validContract,
                        contract: validAddress,
                        amount: 20,
                    },
                ],
            });

            const cost = result.calc_cost(params);
            expect(cost).toBe(500n); // 5 * min_txfee_io (2 inputs + 3 outputs)
        });
    });

    describe("edge cases", () => {
        it("should handle undefined inputs/outputs in proxy", () => {
            const result = new exec_result_t({});

            expect(() => {
                const proxy = result.getHashProxy();
                proxy.inputs;
                proxy.outputs;
            }).not.toThrow();
        });

        it("should handle large cost values", () => {
            const result = new exec_result_t({
                did_fail: false,
                total_cost: 999999999,
                total_fee: 999999999,
                inputs: [],
                outputs: [],
                error: null,
            });

            expect(() => {
                result.hash_serialize(false);
                result.calc_hash(false);
            }).not.toThrow();
        });

        it("should handle error with calc_hash method", () => {
            // Error with calc_hash method (like hash_t)
            const result = new exec_result_t({
                error: {
                    calc_hash: () => "error_hash",
                },
            });

            expect(() => {
                result.hash_serialize(false);
            }).not.toThrow();
        });

        it("should handle boolean flags correctly", () => {
            const resultTrue = new exec_result_t({
                did_fail: true,
                total_cost: 0,
                total_fee: 0,
                inputs: [],
                outputs: [],
                error: null,
            });

            const resultFalse = new exec_result_t({
                did_fail: false,
                total_cost: 0,
                total_fee: 0,
                inputs: [],
                outputs: [],
                error: null,
            });

            expect(resultTrue.hash_serialize(false)).not.toEqual(resultFalse.hash_serialize(false));
        });
    });
});
