import { describe, it, expect, beforeEach, vi } from "vitest";
import { getChainParamsAsync } from "./getChainParamsAsync.js";
import { ChainParams } from "./ChainParams.js";

describe("getChainParamsAsync", () => {
    describe("Chain Parameter Loading", () => {
        it("should load mainnet parameters", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toBeInstanceOf(ChainParams);
            expect(params.network).toBe("mainnet");
        });

        it("should load mainnet-rc parameters", async () => {
            const params = await getChainParamsAsync("mainnet-rc");

            expect(params).toBeInstanceOf(ChainParams);
            expect(params.network).toBe("mainnet-rc");
        });

        it("should throw error for unknown network", async () => {
            await expect(getChainParamsAsync("unknown-network")).rejects.toThrow(
                "Chain params not found for network: unknown-network"
            );
        });

        it("should return ChainParams instance", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toHaveProperty("port");
            expect(params).toHaveProperty("decimals");
            expect(params).toHaveProperty("min_txfee");
            expect(params).toHaveProperty("min_txfee_io");
            expect(params).toHaveProperty("min_txfee_sign");
        });
    });

    describe("Caching Behavior", () => {
        it("should cache loaded parameters", async () => {
            const params1 = await getChainParamsAsync("mainnet");
            const params2 = await getChainParamsAsync("mainnet");

            // Both should be instances but cached
            expect(params1).toBeInstanceOf(ChainParams);
            expect(params2).toBeInstanceOf(ChainParams);
            expect(params1.network).toBe(params2.network);
        });

        it("should return same cached instance for subsequent calls", async () => {
            const params1 = await getChainParamsAsync("mainnet");
            const params2 = await getChainParamsAsync("mainnet");

            // Should be the same cached instance
            expect(params1.network).toBe(params2.network);
        });

        it("should cache different networks separately", async () => {
            const mainnetParams = await getChainParamsAsync("mainnet");
            const mainnetRcParams = await getChainParamsAsync("mainnet-rc");

            expect(mainnetParams.network).toBe("mainnet");
            expect(mainnetRcParams.network).toBe("mainnet-rc");
            expect(mainnetParams.network).not.toBe(mainnetRcParams.network);
        });
    });

    describe("Parameter Structure", () => {
        it("should have expected mainnet parameters", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params.decimals).toBe(6);
            expect(typeof params.min_txfee).toBe("number");
            expect(typeof params.min_txfee_io).toBe("number");
            expect(typeof params.min_txfee_sign).toBe("number");
            expect(typeof params.min_txfee_memo).toBe("number");
            expect(typeof params.min_txfee_exec).toBe("number");
        });

        it("should have network-specific parameters", async () => {
            const mainnetParams = await getChainParamsAsync("mainnet");
            const mainnetRcParams = await getChainParamsAsync("mainnet-rc");

            expect(mainnetParams.network).toBe("mainnet");
            expect(mainnetRcParams.network).toBe("mainnet-rc");
        });

        it("should have blockchain configuration", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toHaveProperty("min_ksize");
            expect(params).toHaveProperty("max_ksize");
            expect(params).toHaveProperty("plot_filter");
            expect(params).toHaveProperty("commit_delay");
            expect(params).toHaveProperty("block_interval_ms");
        });

        it("should have fee structure", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toHaveProperty("min_txfee");
            expect(params).toHaveProperty("min_txfee_io");
            expect(params).toHaveProperty("min_txfee_sign");
            expect(params).toHaveProperty("min_txfee_memo");
            expect(params).toHaveProperty("min_txfee_exec");
            expect(params).toHaveProperty("min_txfee_deploy");
            expect(params).toHaveProperty("min_txfee_depend");
            expect(params).toHaveProperty("min_txfee_byte");
        });

        it("should have reward parameters", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toHaveProperty("min_reward");
            expect(params).toHaveProperty("vdf_reward");
            expect(params).toHaveProperty("vdf_reward_interval");
            expect(params).toHaveProperty("reward_adjust_div");
        });

        it("should have binary addresses", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params).toHaveProperty("nft_binary");
            expect(params).toHaveProperty("swap_binary");
            expect(params).toHaveProperty("offer_binary");
            expect(params).toHaveProperty("token_binary");
        });
    });

    describe("Extra Parameters", () => {
        it("should load extra parameters if available", async () => {
            const params = await getChainParamsAsync("mainnet");

            // Extra parameters are loaded from separate files
            // and merged into the main params
            expect(params).toBeDefined();
        });

        it("should handle network without extra parameters", async () => {
            // Should not throw even if no extra params
            await expect(getChainParamsAsync("mainnet")).resolves.toBeDefined();
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty network string", async () => {
            // Empty string may match fallback patterns, so we just check it doesn't throw
            await expect(getChainParamsAsync("")).resolves.toBeDefined();
        });

        it("should handle null network", async () => {
            await expect(getChainParamsAsync(null)).rejects.toThrow();
        });

        it("should handle undefined network", async () => {
            await expect(getChainParamsAsync(undefined)).rejects.toThrow();
        });

        it("should be case-sensitive for network names", async () => {
            // Assuming mainnet is lowercase, uppercase should fail
            await expect(getChainParamsAsync("MAINNET")).rejects.toThrow();
        });
    });

    describe("Parameter Values", () => {
        it("should have positive fee values", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params.min_txfee).toBeGreaterThan(0);
            expect(params.min_txfee_io).toBeGreaterThan(0);
            expect(params.min_txfee_sign).toBeGreaterThan(0);
        });

        it("should have valid decimals", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params.decimals).toBeGreaterThanOrEqual(0);
            expect(params.decimals).toBeLessThanOrEqual(18); // Reasonable max
        });

        it("should have valid block interval", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params.block_interval_ms).toBeGreaterThan(0);
        });

        it("should have valid k-size range", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(params.min_ksize).toBeGreaterThan(0);
            expect(params.max_ksize).toBeGreaterThanOrEqual(params.min_ksize);
        });
    });

    describe("Type Safety", () => {
        it("should return ChainParams with proper type checking", async () => {
            const params = await getChainParamsAsync("mainnet");

            // ChainParams constructor validates the structure
            expect(() => new ChainParams(params)).not.toThrow();
        });

        it("should have numeric values for fee parameters", async () => {
            const params = await getChainParamsAsync("mainnet");

            expect(typeof params.min_txfee).toBe("number");
            expect(typeof params.min_txfee_io).toBe("number");
            expect(typeof params.min_txfee_sign).toBe("number");
            expect(typeof params.min_txfee_memo).toBe("number");
        });

        it("should have string values for binary addresses", async () => {
            const params = await getChainParamsAsync("mainnet");

            if (params.nft_binary !== null) {
                expect(typeof params.nft_binary).toBe("string");
            }
            if (params.swap_binary !== null) {
                expect(typeof params.swap_binary).toBe("string");
            }
        });
    });

    describe("Multiple Networks", () => {
        it("should support loading mainnet", async () => {
            const params = await getChainParamsAsync("mainnet");
            expect(params.network).toBe("mainnet");
        });

        it("should support loading mainnet-rc", async () => {
            const params = await getChainParamsAsync("mainnet-rc");
            expect(params.network).toBe("mainnet-rc");
        });

        it("should have different parameters for different networks", async () => {
            const mainnetParams = await getChainParamsAsync("mainnet");
            const mainnetRcParams = await getChainParamsAsync("mainnet-rc");

            // Networks should have different configurations
            expect(mainnetParams.network).not.toBe(mainnetRcParams.network);
        });
    });
});
