import { describe, it, expect, beforeEach } from "vitest";
import { ChainParams } from "./ChainParams";

describe("ChainParams", () => {
    describe("constructor", () => {
        it("should throw error when params is undefined", () => {
            expect(() => new ChainParams()).toThrowError("params is required");
        });

        it("should throw error when params is null", () => {
            expect(() => new ChainParams(null)).toThrowError("params is required");
        });

        it("should throw error when params is not an object", () => {
            expect(() => new ChainParams("string")).toThrowError("params must be an object");
            expect(() => new ChainParams(123)).toThrowError("params must be an object");
            expect(() => new ChainParams(true)).toThrowError("params must be an object");
        });

        it("should create instance with empty object params", () => {
            const chainParams = new ChainParams({});
            expect(chainParams).toBeInstanceOf(ChainParams);
        });

        it("should assign all provided params using Object.assign", () => {
            const customParams = {
                port: 8080,
                decimals: 8,
                min_ksize: 30,
                network: "testnet",
                custom_field: "test_value",
            };

            const chainParams = new ChainParams(customParams);

            expect(chainParams.port).toBe(8080);
            expect(chainParams.decimals).toBe(8);
            expect(chainParams.min_ksize).toBe(30);
            expect(chainParams.network).toBe("testnet");
            expect(chainParams.custom_field).toBe("test_value");
        });

        it("should override default values with provided params", () => {
            const customParams = {
                decimals: 8,
                min_ksize: 30,
            };

            const chainParams = new ChainParams(customParams);

            // Override values
            expect(chainParams.decimals).toBe(8);
            expect(chainParams.min_ksize).toBe(30);

            // Default values should remain
            expect(chainParams.port).toBe(0);
            expect(chainParams.max_ksize).toBe(32);
            expect(chainParams.plot_filter).toBe(4);
        });
    });
});
