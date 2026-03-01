import { describe, it, expect } from "vitest";
import { txio_t, txin_t, txout_t } from "./txio_t.js";
import { addr_t } from "./addr_t.js";
import { optional } from "./optional.js";
import { ChainParams } from "../utils/ChainParams.js";

describe("Transaction I/O Types", () => {
    const validAddress = "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev";
    const validContract = "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6";

    describe("txio_t", () => {
        describe("Constructor", () => {
            it("should create txio_t with default values", () => {
                const txio = new txio_t({});
                expect(txio.address).toBe("");
                expect(txio.contract).toBeUndefined();
                expect(txio.amount).toBe("0");
                expect(txio.memo).toBe(null);
            });

            it("should create txio_t with custom values", () => {
                const txio = new txio_t({
                    address: validAddress,
                    contract: validContract,
                    amount: 1000000,
                    memo: "test memo",
                });

                expect(txio.address).toBe(validAddress);
                expect(txio.contract).toBe(validContract);
                expect(txio.amount).toBe("1000000");
                expect(txio.memo).toBe("test memo");
            });

            it("should convert amount to string", () => {
                const txio = new txio_t({ amount: 123456789n });
                expect(txio.amount).toBe("123456789");
                expect(typeof txio.amount).toBe("string");
            });

            it("should handle undefined parameters", () => {
                const txio = new txio_t();
                expect(txio.address).toBe("");
                expect(txio.contract).toBeUndefined();
                expect(txio.amount).toBe("0");
                expect(txio.memo).toBe(null);
            });
        });

        describe("Hash Proxy", () => {
            it("should create hash proxy correctly", () => {
                const txio = new txio_t({
                    address: validAddress,
                    amount: 1000000,
                    memo: "test",
                });

                const proxy = txio.getHashProxy();

                expect(proxy.address).toBeInstanceOf(addr_t);
                expect(proxy.amount).toBe(1000000n);
                expect(proxy.memo).toBeInstanceOf(optional);
            });

            it("should convert address to addr_t in proxy", () => {
                const txio = new txio_t({ address: validAddress });
                const proxy = txio.getHashProxy();

                expect(proxy.address).toBeInstanceOf(addr_t);
                expect(proxy.address.toString()).toBe(validAddress);
            });

            it("should convert contract to addr_t in proxy with valid contract", () => {
                const txio = new txio_t({
                    address: validAddress,
                    contract: validAddress, // Using same valid address
                });
                const proxy = txio.getHashProxy();

                expect(proxy.contract).toBeInstanceOf(addr_t);
                expect(proxy.contract.toString()).toBe(validAddress);
            });

            it("should convert amount to BigInt in proxy", () => {
                const txio = new txio_t({ amount: "1234567890" });
                const proxy = txio.getHashProxy();

                expect(proxy.amount).toBe(1234567890n);
                expect(typeof proxy.amount).toBe("bigint");
            });

            it("should wrap memo in optional in proxy", () => {
                const txio = new txio_t({ memo: "test memo" });
                const proxy = txio.getHashProxy();

                expect(proxy.memo).toBeInstanceOf(optional);
                expect(proxy.memo.valueOf()).toBe("test memo");
            });

            it("should handle null memo in proxy", () => {
                const txio = new txio_t({ memo: null });
                const proxy = txio.getHashProxy();

                expect(proxy.memo).toBeInstanceOf(optional);
                expect(proxy.memo.valueOf()).toBeUndefined();
            });
        });

        describe("Cost Calculation", () => {
            it("should calculate cost without memo", () => {
                const txio = new txio_t({
                    address: validAddress,
                    amount: 1000000,
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 1000,
                    min_txfee_memo: 500,
                });

                const cost = txio.calc_cost(mockParams);
                expect(cost).toBe(1000n);
            });

            it("should calculate cost with memo", () => {
                const txio = new txio_t({
                    address: validAddress,
                    amount: 1000000,
                    memo: "test memo",
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 1000,
                    min_txfee_memo: 500,
                });

                // memo length = 9, (9 + 31) / 32 = 1.25, floor = 1
                const expectedCost = 1000n + 1n * 500n;
                const cost = txio.calc_cost(mockParams);
                expect(cost).toBe(expectedCost);
            });

            it("should calculate cost with long memo", () => {
                const longMemo = "a".repeat(64); // Max memo size
                const txio = new txio_t({
                    address: validAddress,
                    amount: 1000000,
                    memo: longMemo,
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 1000,
                    min_txfee_memo: 500,
                });

                // memo length = 64, (64 + 31) / 32 = 2.96875, floor = 2
                const expectedCost = 1000n + 2n * 500n;
                const cost = txio.calc_cost(mockParams);
                expect(cost).toBe(expectedCost);
            });

            it("should handle zero fees", () => {
                const txio = new txio_t({
                    address: validAddress,
                    amount: 1000000,
                    memo: "test",
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 0,
                    min_txfee_memo: 0,
                });

                const cost = txio.calc_cost(mockParams);
                expect(cost).toBe(0n);
            });
        });

        describe("Constants", () => {
            it("should have MAX_MEMO_SIZE constant", () => {
                expect(txio_t.MAX_MEMO_SIZE).toBe(64);
            });
        });
    });

    describe("txin_t", () => {
        describe("Constructor", () => {
            it("should create txin_t with default values", () => {
                const txin = new txin_t({});
                expect(txin.address).toBe("");
                expect(txin.contract).toBeUndefined();
                expect(txin.amount).toBe("0");
                expect(txin.memo).toBe(null);
                expect(txin.solution).toBe(-1);
                expect(txin.flags).toBe(0);
            });

            it("should create txin_t with custom values", () => {
                const txin = new txin_t({
                    address: validAddress,
                    contract: validContract,
                    amount: 1000000,
                    memo: "input memo",
                    solution: 0,
                    flags: 1,
                });

                expect(txin.address).toBe(validAddress);
                expect(txin.contract).toBe(validContract);
                expect(txin.amount).toBe("1000000");
                expect(txin.memo).toBe("input memo");
                expect(txin.solution).toBe(0);
                expect(txin.flags).toBe(1);
            });

            it("should inherit from txio_t", () => {
                const txin = new txin_t({});
                expect(txin).toBeInstanceOf(txio_t);
                expect(txin).toBeInstanceOf(txin_t);
            });

            it("should handle solution index", () => {
                const txin = new txin_t({ solution: 5 });
                expect(txin.solution).toBe(5);
            });

            it("should handle NO_SOLUTION flag", () => {
                const txin = new txin_t({ solution: txin_t.NO_SOLUTION });
                expect(txin.solution).toBe(-1);
            });

            it("should handle IS_EXEC flag", () => {
                const txin = new txin_t({ flags: txin_t.IS_EXEC });
                expect(txin.flags).toBe(1);
            });
        });

        describe("Constants", () => {
            it("should have NO_SOLUTION constant", () => {
                expect(txin_t.NO_SOLUTION).toBe(-1);
            });

            it("should have IS_EXEC constant", () => {
                expect(txin_t.IS_EXEC).toBe(1);
            });
        });

        describe("Inheritance", () => {
            it("should inherit calc_cost from txio_t", () => {
                const txin = new txin_t({
                    address: validAddress,
                    amount: 1000000,
                    memo: "test",
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 1000,
                    min_txfee_memo: 500,
                });

                const cost = txin.calc_cost(mockParams);
                expect(typeof cost).toBe("bigint");
                expect(cost).toBeGreaterThan(0n);
            });

            it("should inherit getHashProxy from txio_t", () => {
                const txin = new txin_t({
                    address: validAddress,
                    amount: 1000000,
                });

                const proxy = txin.getHashProxy();
                expect(proxy.address).toBeInstanceOf(addr_t);
                expect(proxy.amount).toBe(1000000n);
            });
        });
    });

    describe("txout_t", () => {
        describe("Constructor", () => {
            it("should create txout_t with default values", () => {
                const txout = new txout_t({});
                expect(txout.address).toBe("");
                expect(txout.contract).toBeUndefined();
                expect(txout.amount).toBe("0");
                expect(txout.memo).toBe(null);
            });

            it("should create txout_t with custom values", () => {
                const txout = new txout_t({
                    address: validAddress,
                    contract: validContract,
                    amount: 2000000,
                    memo: "output memo",
                });

                expect(txout.address).toBe(validAddress);
                expect(txout.contract).toBe(validContract);
                expect(txout.amount).toBe("2000000");
                expect(txout.memo).toBe("output memo");
            });

            it("should inherit from txio_t", () => {
                const txout = new txout_t({});
                expect(txout).toBeInstanceOf(txio_t);
                expect(txout).toBeInstanceOf(txout_t);
            });

            it("should not have solution or flags properties", () => {
                const txout = new txout_t({});
                expect(txout.solution).toBeUndefined();
                expect(txout.flags).toBeUndefined();
            });
        });

        describe("Inheritance", () => {
            it("should inherit calc_cost from txio_t", () => {
                const txout = new txout_t({
                    address: validAddress,
                    amount: 2000000,
                    memo: "test output",
                });

                const mockParams = new ChainParams({
                    min_txfee_io: 1000,
                    min_txfee_memo: 500,
                });

                const cost = txout.calc_cost(mockParams);
                expect(typeof cost).toBe("bigint");
                expect(cost).toBeGreaterThan(0n);
            });

            it("should inherit getHashProxy from txio_t", () => {
                const txout = new txout_t({
                    address: validAddress,
                    amount: 2000000,
                });

                const proxy = txout.getHashProxy();
                expect(proxy.address).toBeInstanceOf(addr_t);
                expect(proxy.amount).toBe(2000000n);
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle very large amounts", () => {
            const largeAmount = "999999999999999999";
            const txio = new txio_t({ amount: largeAmount });
            const proxy = txio.getHashProxy();

            expect(txio.amount).toBe(largeAmount);
            expect(proxy.amount).toBe(999999999999999999n);
        });

        it("should handle empty string address", () => {
            const txio = new txio_t({ address: "" });
            expect(txio.address).toBe("");

            // addr_t will throw on empty string, so we test that it throws
            expect(() => {
                const proxy = txio.getHashProxy();
                proxy.address;
            }).toThrowError("Invalid address");
        });

        it("should handle undefined contract", () => {
            const txio = new txio_t({ contract: undefined });
            expect(txio.contract).toBeUndefined();

            // addr_t handles undefined by creating zero-filled array
            const proxy = txio.getHashProxy();
            expect(proxy.contract).toBeInstanceOf(addr_t);
            // Zero-filled address
            expect(proxy.contract.toString()).toBe("mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev");
        });

        it("should handle empty memo", () => {
            const txio = new txio_t({ memo: "" });
            const proxy = txio.getHashProxy();

            expect(txio.memo).toBe("");
            expect(proxy.memo).toBeInstanceOf(optional);
        });

        it("should handle memo at max size", () => {
            const maxMemo = "x".repeat(txio_t.MAX_MEMO_SIZE);
            const txio = new txio_t({ memo: maxMemo });

            expect(txio.memo.length).toBe(64);
        });
    });
});
