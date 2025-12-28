import { describe, it, expect } from "vitest";
import { TokenBase, Executable } from "./Contract.js";
import { ChainParams } from "../utils/ChainParams.js";

describe("Contract", () => {
    describe("TokenBase", () => {
        it("should create a TokenBase with default values", () => {
            const token = new TokenBase({});

            expect(token.__type).toBe("mmx.contract.TokenBase");
            expect(token.version).toBe(0);
            expect(token.name).toBe("");
            expect(token.symbol).toBe("");
            expect(token.decimals).toBe(0);
            expect(token.meta_data).toBe(null);
        });

        it("should create a TokenBase with provided values", () => {
            const token = new TokenBase({
                version: 1,
                name: "Test Token",
                symbol: "TST",
                decimals: 6,
                meta_data: { description: "A test token" },
            });

            expect(token.version).toBe(1);
            expect(token.name).toBe("Test Token");
            expect(token.symbol).toBe("TST");
            expect(token.decimals).toBe(6);
            expect(token.meta_data).toEqual({ description: "A test token" });
        });

        it("should calculate num_bytes correctly for empty token", () => {
            const token = new TokenBase({});
            const bytes = token.num_bytes();

            // Base contract: 16 + name.length (0) + symbol.length (0) + meta_data bytes
            expect(bytes).toBeGreaterThan(0);
        });

        it("should calculate num_bytes correctly for token with data", () => {
            const token = new TokenBase({
                name: "Test",
                symbol: "TST",
                decimals: 6,
            });
            const bytes = token.num_bytes();

            // Should include lengths of name and symbol
            expect(bytes).toBeGreaterThan(16);
        });

        it("should return hash proxy with Variant for meta_data", () => {
            const token = new TokenBase({
                meta_data: { key: "value" },
            });

            const proxy = token.getHashProxy();
            expect(proxy.meta_data).toBeDefined();
            expect(proxy.meta_data.constructor.name).toBe("Variant");
        });

        it("should handle null meta_data in hash proxy", () => {
            const token = new TokenBase({});

            const proxy = token.getHashProxy();
            expect(proxy.meta_data).toBeDefined();
        });
    });

    describe("Executable", () => {
        it("should create an Executable with default values", () => {
            const executable = new Executable({});

            expect(executable.__type).toBe("mmx.contract.Executable");
            expect(executable.version).toBe(0);
            expect(executable.name).toBe("");
            expect(executable.symbol).toBe("");
            expect(executable.decimals).toBe(0);
            expect(executable.meta_data).toBe(null);
            expect(executable.binary).toBe("");
            expect(executable.init_method).toBe("init");
            expect(executable.init_args).toEqual([]);
            expect(executable.depends).toEqual([]);
        });

        it("should create an Executable with provided values", () => {
            const executable = new Executable({
                version: 1,
                name: "Test Contract",
                symbol: "TC",
                decimals: 6,
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "initialize",
                init_args: [100, "arg1"],
                depends: [],
            });

            expect(executable.version).toBe(1);
            expect(executable.name).toBe("Test Contract");
            expect(executable.symbol).toBe("TC");
            expect(executable.decimals).toBe(6);
            expect(executable.binary).toBe("mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev");
            expect(executable.init_method).toBe("initialize");
            expect(executable.init_args).toEqual([100, "arg1"]);
            expect(executable.depends).toEqual([]);
        });

        it("should return hash proxy with addr_t for binary", () => {
            const executable = new Executable({
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
            });

            const proxy = executable.getHashProxy();
            expect(proxy.binary).toBeDefined();
            expect(proxy.binary.constructor.name).toBe("addr_t");
        });

        it("should return hash proxy with Variant array for init_args", () => {
            const executable = new Executable({
                init_args: [100, "test"],
            });

            const proxy = executable.getHashProxy();
            expect(proxy.init_args).toBeDefined();
            expect(Array.isArray(proxy.init_args)).toBe(true);
            expect(proxy.init_args.length).toBe(2);
            expect(proxy.init_args[0].constructor.name).toBe("Variant");
        });

        it("should return empty Map for depends when empty", () => {
            const executable = new Executable({
                depends: [],
            });

            const proxy = executable.getHashProxy();
            expect(proxy.depends).toBeDefined();
            expect(proxy.depends instanceof Map).toBe(true);
            expect(proxy.depends.size).toBe(0);
        });

        it("should throw error for non-empty depends", () => {
            const executable = new Executable({
                depends: ["something"],
            });

            expect(() => {
                const proxy = executable.getHashProxy();
                proxy.depends; // Access the property
            }).toThrow("Not implemented");
        });

        it("should serialize hash correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                decimals: 6,
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "init",
            });

            const serialized = executable.hash_serialize(false);
            expect(serialized).toBeDefined();
            expect(serialized.byteLength).toBeGreaterThan(0);
        });

        it("should calculate hash correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                decimals: 6,
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "init",
            });

            const hash = executable.calc_hash(false);
            expect(hash).toBeDefined();
            expect(typeof hash).toBe("object");
            expect(hash.constructor.name).toBe("hash_t");
        });

        it("should calculate num_bytes correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                decimals: 6,
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "init",
                init_args: [100],
            });

            const bytes = executable.num_bytes();
            expect(bytes).toBeGreaterThan(0);
            // Should include: parent bytes + 32 (binary) + init_method length + init_args bytes
            expect(bytes).toBeGreaterThan(50);
        });

        it("should calculate cost correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                decimals: 6,
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "init",
            });

            const params = new ChainParams({
                min_txfee_byte: 10,
                min_txfee_depend: 50000,
            });

            const cost = executable.calc_cost(params);
            expect(cost).toBeGreaterThan(0n);
            expect(typeof cost).toBe("bigint");
        });

        it("should calculate cost with depends correctly", () => {
            const executable = new Executable({
                name: "Test",
                symbol: "TST",
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_method: "init",
                depends: [], // Empty depends should not add extra cost
            });

            const params = new ChainParams({
                min_txfee_byte: 10,
                min_txfee_depend: 50000,
            });

            const cost = executable.calc_cost(params);
            expect(cost).toBeGreaterThan(0n);
            // Cost should be num_bytes * min_txfee_byte (no depends)
            expect(cost).toBe(BigInt(executable.num_bytes()) * 10n);
        });

        it("should use parent TokenBase hashHandler for inherited properties", () => {
            const executable = new Executable({
                meta_data: { test: "value" },
            });

            const proxy = executable.getHashProxy();
            // Should fallback to TokenBase handler
            expect(proxy.meta_data.constructor.name).toBe("Variant");
        });

        it("should handle multiple init_args of different types", () => {
            const executable = new Executable({
                binary: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                init_args: [100, "string", true, { key: "value" }],
            });

            const proxy = executable.getHashProxy();
            expect(proxy.init_args.length).toBe(4);
            proxy.init_args.forEach((arg) => {
                expect(arg.constructor.name).toBe("Variant");
            });
        });
    });
});
