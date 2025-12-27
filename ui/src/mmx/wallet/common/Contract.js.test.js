import { describe, it, expect } from "vitest";
import { TokenBase, Executable } from "./Contract.js";
import { addr_t } from "./addr_t.js";
import { Variant } from "./Variant.js";
import { ChainParams } from "../utils/ChainParams.js";

import "../utils/Uint8ArrayUtils.js";

describe("Contract", () => {
    describe("TokenBase", () => {
        it("should create token with default values", () => {
            const token = new TokenBase({});
            expect(token.name).toBe("");
            expect(token.symbol).toBe("");
            expect(token.decimals).toBe(0);
            expect(token.meta_data).toBe(null);
            expect(token.__type).toBe("mmx.contract.TokenBase");
        });

        it("should create token with custom values", () => {
            const params = {
                name: "Test Token",
                symbol: "TEST",
                decimals: 6,
                meta_data: { description: "A test token" },
            };
            const token = new TokenBase(params);
            expect(token.name).toBe("Test Token");
            expect(token.symbol).toBe("TEST");
            expect(token.decimals).toBe(6);
            expect(token.meta_data).toEqual({ description: "A test token" });
        });

        it("should create hash proxy correctly", () => {
            const token = new TokenBase({ meta_data: { test: "value" } });
            const proxy = token.getHashProxy();

            expect(proxy.name).toBe("");
            expect(proxy.symbol).toBe("");
            expect(proxy.decimals).toBe(0);
            expect(proxy.meta_data).toBeInstanceOf(Variant);
            expect(proxy.meta_data.valueOf()).toEqual({ test: "value" });
        });

        it("should handle null meta_data in hash proxy", () => {
            const token = new TokenBase({ meta_data: null });
            const proxy = token.getHashProxy();

            expect(proxy.meta_data).toBeInstanceOf(Variant);
            expect(proxy.meta_data.valueOf()).toBe(null);
        });

        it("should calculate num_bytes correctly", () => {
            const token = new TokenBase({
                name: "Test",
                symbol: "TST",
                meta_data: null,
            });

            // Base contract (16) + name length (4) + symbol length (3) + meta_data (1 for null)
            const expectedBytes = 16 + 4 + 3 + 1;
            expect(token.num_bytes()).toBe(expectedBytes);
        });

        it("should calculate num_bytes with meta_data", () => {
            const token = new TokenBase({
                name: "Test",
                symbol: "TST",
                meta_data: { key: "value" },
            });

            // Base contract (16) + name (4) + symbol (3) + meta_data object size
            // meta_data: 4 (object header) + 3 (key length) + (4 + 5) (value)
            const expectedBytes = 16 + 4 + 3 + (4 + 3 + 4 + 5);
            expect(token.num_bytes()).toBe(expectedBytes);
        });
    });

    describe("Executable", () => {
        const validParams = {
            name: "Test Contract",
            symbol: "TC",
            decimals: 0,
            binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
            init_method: "init",
            init_args: ["arg1", "arg2"],
            depends: [],
        };

        it("should create executable with default values", () => {
            const executable = new Executable({});
            expect(executable.binary).toBe("");
            expect(executable.init_method).toBe("init");
            expect(executable.init_args).toEqual([]);
            expect(executable.depends).toEqual([]);
            expect(executable.__type).toBe("mmx.contract.Executable");
        });

        it("should create executable with custom values", () => {
            const executable = new Executable(validParams);
            expect(executable.name).toBe("Test Contract");
            expect(executable.symbol).toBe("TC");
            expect(executable.binary).toBe("mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev");
            expect(executable.init_method).toBe("init");
            expect(executable.init_args).toEqual(["arg1", "arg2"]);
            expect(executable.depends).toEqual([]);
        });

        it("should create hash proxy correctly", () => {
            const executable = new Executable(validParams);
            const proxy = executable.getHashProxy();

            expect(proxy.binary).toBeInstanceOf(addr_t);
            expect(proxy.binary.toString()).toBe("mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev");
            expect(proxy.init_args).toHaveLength(2);
            expect(proxy.init_args[0]).toBeInstanceOf(Variant);
            expect(proxy.init_args[1]).toBeInstanceOf(Variant);
            expect(proxy.depends).toBeInstanceOf(Map);
            expect(proxy.depends.size).toBe(0);
        });

        it("should throw error for non-empty depends", () => {
            const executable = new Executable({ depends: ["dependency"] });
            const proxy = executable.getHashProxy();

            expect(() => proxy.depends).toThrowError("Not implemented");
        });

        it("should serialize hash correctly", () => {
            const executable = new Executable(validParams);
            const serialized = executable.hash_serialize(true);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });

        it("should calculate hash correctly", () => {
            const executable = new Executable(validParams);
            const hash = executable.calc_hash(true);

            expect(hash).toBeInstanceOf(Uint8Array);
            expect(hash.length).toBe(32);
        });

        it("should calculate num_bytes correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                meta_data: null,
                init_method: "init",
                init_args: ["arg1"],
                depends: [],
            });

            // TokenBase bytes + 32 (binary) + init_method length + args bytes + depends
            const tokenBaseBytes = 16 + 4 + 3 + 1; // name + symbol + meta_data
            const executableBytes = tokenBaseBytes + 32 + 4 + (4 + 4) + 0; // binary + init_method + args + depends
            expect(executable.num_bytes()).toBe(executableBytes);
        });

        it("should calculate cost correctly", () => {
            const executable = new Executable(validParams);
            const mockParams = new ChainParams({
                min_txfee_byte: 1000,
                min_txfee_depend: 5000,
            });

            const cost = executable.calc_cost(mockParams);
            expect(typeof cost).toBe("bigint");
            expect(cost).toBeGreaterThan(0n);

            // Cost should be num_bytes * min_txfee_byte + depends.size * min_txfee_depend
            const expectedCost = BigInt(executable.num_bytes()) * 1000n + 0n * 5000n;
            expect(cost).toBe(expectedCost);
        });

        it("should handle empty init_args", () => {
            const executable = new Executable({
                ...validParams,
                init_args: [],
            });

            const proxy = executable.getHashProxy();
            expect(proxy.init_args).toHaveLength(0);

            const hash = executable.calc_hash(true);
            expect(hash).toBeInstanceOf(Uint8Array);
        });

        it("should handle complex init_args", () => {
            const executable = new Executable({
                ...validParams,
                init_args: ["string_arg", 123, true, null, { nested: "object" }, ["array", "values"]],
            });

            const proxy = executable.getHashProxy();
            expect(proxy.init_args).toHaveLength(6);
            proxy.init_args.forEach((arg) => {
                expect(arg).toBeInstanceOf(Variant);
            });
        });

        it("should inherit from TokenBase correctly", () => {
            const executable = new Executable(validParams);
            expect(executable).toBeInstanceOf(TokenBase);
            expect(executable).toBeInstanceOf(Executable);
        });

        it("should handle inheritance in hash proxy", () => {
            const executable = new Executable({
                ...validParams,
                meta_data: { test: "value" },
            });
            const proxy = executable.getHashProxy();

            // Should have TokenBase properties
            expect(proxy.meta_data).toBeInstanceOf(Variant);
            expect(proxy.meta_data.valueOf()).toEqual({ test: "value" });

            // Should have Executable properties
            expect(proxy.binary).toBeInstanceOf(addr_t);
            expect(proxy.init_args).toBeInstanceOf(Array);
        });
    });

    describe("Error handling", () => {
        it("should handle invalid binary address", () => {
            expect(() => {
                const executable = new Executable({
                    binary: "invalid_address",
                });
                const proxy = executable.getHashProxy();
                // This should trigger addr_t validation
                proxy.binary;
            }).toThrowError();
        });

        it("should handle undefined parameters gracefully", () => {
            const token = new TokenBase({});
            expect(token.name).toBe("");
            expect(token.version).toBe(0);

            const executable = new Executable({});
            expect(executable.binary).toBe("");
            expect(executable.version).toBe(0);
        });
    });
});
