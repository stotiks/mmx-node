import { describe, it, expect } from "vitest";
import { getTransactionVersion } from "./getTransactionVersion";
import { getChainParamsAsync } from "./getChainParamsAsync";

describe("getTransactionVersion", async () => {
    const hardfork2_height = 5050000;
    const chainParams = await getChainParamsAsync("mainnet");

    describe("v0", () => {
        it("should return 0", () => {
            expect(getTransactionVersion(chainParams, 0)).toBe(0);
        });
        it("should return 0", () => {
            expect(getTransactionVersion(chainParams, hardfork2_height - 1)).toBe(0);
        });
    });

    describe("v1", () => {
        it("should return 1", () => {
            expect(getTransactionVersion(chainParams, hardfork2_height)).toBe(1);
        });
    });
});
