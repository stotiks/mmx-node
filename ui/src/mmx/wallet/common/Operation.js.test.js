import { assert, describe, expect, it } from "vitest";
import { Deposit, Operation } from "./Operation";

import { toUpperHex } from "../utils/Uint8ArrayUtils";

describe("mmx.operation.Deposit", () => {
    const json =
        '{"__type": "mmx.operation.Deposit", "version": 0, "address": "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x", "solution": 65535, "method": "trade", "args": ["mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6", "0x4189374bc6a7f0"], "user": null, "currency": "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev", "amount": "1000001"}';

    const hex =
        "ECB0047BCB0834C26669656C643C3E737472696E673C3E070000000000000076657273696F6E00000000000000006669656C643C3E737472696E673C3E07000000000000006164647265737362797465733C3E2000000000000000BBCA4395D3145874DEA7C947B5CE07E3554CA5F27ADCC79E45D0510C803CED166669656C643C3E737472696E673C3E06000000000000006D6574686F64737472696E673C3E050000000000000074726164656669656C643C3E737472696E673C3E040000000000000061726773766563746F723C3E0200000000000000737472696E673C3E3E000000000000006D6D7831366171357670636D786372683978636B307A303665716E6D723837773572326A303632736E6A6A36673763766A30746872793771306D70337736737472696E673C3E1000000000000000307834313839333734626336613766306669656C643C3E737472696E673C3E0400000000000000757365726F7074696F6E616C3C3E006669656C643C3E737472696E673C3E080000000000000063757272656E637962797465733C3E200000000000000000000000000000000000000000000000000000000000000000000000000000006669656C643C3E737472696E673C3E0600000000000000616D6F756E7441420F000000000000000000000000006669656C643C3E737472696E673C3E0800000000000000736F6C7574696F6EFFFF000000000000";

    it("hash_serialize", () => {
        const obj = JSON.parse(json);
        const op = new Operation(obj);
        const hash_serialize = op.hash_serialize(true);
        assert.equal(toUpperHex(hash_serialize), hex);
    });

    describe("constructor", () => {
        it("should set all Deposit-specific parameters when provided", () => {
            const params = {
                __type: "mmx.operation.Deposit",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 123,
                method: "trade",
                args: ["arg1"],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "5000",
            };

            const op = new Deposit(params);

            expect(op.__type).toBe("mmx.operation.Deposit");
            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(params.solution);
            expect(op.method).toBe(params.method);
            expect(op.currency).toBe(params.currency);
            expect(op.amount).toBe(5000n);
        });

        it("should convert string amount to BigInt", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1234567890",
            };

            const op = new Deposit(params);
            expect(op.amount).toBe(1234567890n);
        });

        it("should handle numeric amount", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 1000,
            };

            const op = new Deposit(params);
            expect(op.amount).toBe(1000n);
        });

        it("should handle BigInt amount", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: 9999n,
            };

            const op = new Deposit(params);
            expect(op.amount).toBe(9999n);
        });
    });

    describe("toJSON", () => {
        it("should serialize Deposit operation to JSON with amount as string", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "trade",
                args: ["arg1"],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000001",
            };

            const op = new Deposit(params);
            const json = op.toJSON();

            expect(json).toEqual({
                __type: "mmx.operation.Deposit",
                version: 0,
                address: params.address,
                solution: params.solution,
                method: params.method,
                args: params.args,
                user: params.user,
                currency: params.currency,
                amount: "1000001",
            });
        });
    });

    describe("getHashProxy", () => {
        it("should return proxy that transforms currency field to addr_t", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const proxy = op.getHashProxy();

            expect(proxy.currency).toBeDefined();
            expect(proxy.currency.constructor.name).toBe("addr_t");
            expect(proxy.currency.toString()).toBe(params.currency);
        });

        it("should return proxy that transforms amount field to uint128", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const proxy = op.getHashProxy();

            expect(proxy.amount).toBeDefined();
            expect(proxy.amount.constructor.name).toBe("uint128");
            expect(proxy.amount.valueOf()).toBe(1000n);
        });

        it("should delegate to Execute.hashHandler for non-Deposit fields", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "trade",
                args: ["arg1"],
                user: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const proxy = op.getHashProxy();

            // These should be handled by Execute.hashHandler
            expect(proxy.address.constructor.name).toBe("addr_t");
            expect(Array.isArray(proxy.args)).toBe(true);
            expect(proxy.user.constructor.name).toBe("optional");
        });
    });

    describe("calc_hash", () => {
        it("should calculate hash for Deposit without solution", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "trade",
                args: [],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const hash = op.calc_hash(false);

            expect(hash).toBeDefined();
            expect(hash.toString()).toBeTruthy();
        });

        it("should calculate hash for Deposit with solution", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "trade",
                args: [],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const hash = op.calc_hash(true);

            expect(hash).toBeDefined();
            expect(hash.toString()).toBeTruthy();
        });

        it("should produce different hashes for different amounts", () => {
            const params1 = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "trade",
                args: [],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const params2 = {
                ...params1,
                amount: "2000",
            };

            const op1 = new Deposit(params1);
            const op2 = new Deposit(params2);

            expect(op1.calc_hash(false).toString()).not.toBe(op2.calc_hash(false).toString());
        });
    });

    describe("hash_serialize", () => {
        it("should serialize Deposit with currency and amount fields", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "trade",
                args: [],
                user: null,
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };

            const op = new Deposit(params);
            const serialized = op.hash_serialize(false);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });
    });
});

describe("mmx.operation.Execute", () => {
    const json =
        '{"__type": "mmx.operation.Execute", "version": 0, "address": "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x", "solution": 0, "method": "withdraw", "args": [], "user": "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6"}';

    const hex =
        "D1C198902D01D98C6669656C643C3E737472696E673C3E070000000000000076657273696F6E00000000000000006669656C643C3E737472696E673C3E07000000000000006164647265737362797465733C3E2000000000000000BBCA4395D3145874DEA7C947B5CE07E3554CA5F27ADCC79E45D0510C803CED166669656C643C3E737472696E673C3E06000000000000006D6574686F64737472696E673C3E080000000000000077697468647261776669656C643C3E737472696E673C3E040000000000000061726773766563746F723C3E00000000000000006669656C643C3E737472696E673C3E0400000000000000757365726F7074696F6E616C3C3E0162797465733C3E20000000000000003C19773DC9B0475ACA09957E520DEAFC197B82AC9F78169B7207361B074641D76669656C643C3E737472696E673C3E0800000000000000736F6C7574696F6E0000000000000000";

    it("hash_serialize", () => {
        const obj = JSON.parse(json);
        const op = new Operation(obj);
        const hash_serialize = op.hash_serialize(true);
        assert.equal(toUpperHex(hash_serialize), hex);
    });

    describe("constructor", () => {
        it("should set all parameters when provided", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 123,
                method: "withdraw",
                args: ["arg1", "arg2"],
                user: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });

            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(params.solution);
            expect(op.method).toBe(params.method);
            expect(op.args).toEqual(params.args);
            expect(op.user).toBe(params.user);
        });

        it("should use default values when parameters are undefined", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: undefined,
                method: undefined,
                args: undefined,
                user: undefined,
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });

            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(65535); // NO_SOLUTION default
            expect(op.method).toBeNull(); // Default from class field
            expect(op.args).toEqual([]); // Default from class field
            expect(op.user).toBeNull(); // Default from class field
        });

        it("should use default values when parameters are not provided", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });

            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(65535); // NO_SOLUTION default
            expect(op.method).toBeNull(); // Default from class field
            expect(op.args).toEqual([]); // Default from class field
            expect(op.user).toBeNull(); // Default from class field
        });

        it("should handle null values correctly", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: null,
                method: null,
                args: null,
                user: null,
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });

            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(65535); // Falls back to default via ??
            expect(op.method).toBeNull(); // null is preserved by ??
            expect(op.args).toEqual([]); // null preserved, falls back to default
            expect(op.user).toBeNull(); // null is preserved by ??
        });

        it("should handle zero and empty string values correctly", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 0,
                method: "",
                args: [],
                user: "",
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });

            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(0); // 0 is preserved by ??
            expect(op.method).toBe(""); // Empty string is preserved by ??
            expect(op.args).toEqual([]); // Empty array is preserved by ??
            expect(op.user).toBe(""); // Empty string is preserved by ??
        });
    });
    describe("toJSON", () => {
        it("should serialize Execute operation to JSON", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 0,
                method: "withdraw",
                args: ["arg1"],
                user: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
            };

            const op = new Operation({ __type: "mmx.operation.Execute", ...params });
            const json = op.toJSON();

            expect(json).toEqual({
                __type: "mmx.operation.Execute",
                version: 0,
                address: params.address,
                solution: params.solution,
                method: params.method,
                args: params.args,
                user: params.user,
            });
        });
    });

    describe("calc_hash", () => {
        it("should calculate hash without solution (full_hash=false)", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const hash = op.calc_hash(false);

            expect(hash).toBeDefined();
            expect(hash.toString()).toBeTruthy();
        });

        it("should calculate hash with solution (full_hash=true)", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const hash = op.calc_hash(true);

            expect(hash).toBeDefined();
            expect(hash.toString()).toBeTruthy();
        });

        it("should produce different hashes for full_hash true vs false", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const hashWithoutSolution = op.calc_hash(false);
            const hashWithSolution = op.calc_hash(true);

            expect(hashWithoutSolution.toString()).not.toBe(hashWithSolution.toString());
        });
    });

    describe("calc_cost", () => {
        it("should calculate cost based on method length", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
            };

            const op = new Operation(params);
            const cost = op.calc_cost({ min_txfee_byte: 1024 });

            expect(typeof cost).toBe("bigint");
            expect(cost).toBeGreaterThan(0n);
        });

        it("should calculate higher cost for operations with args", () => {
            const paramsNoArgs = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
            };

            const paramsWithArgs = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: ["arg1", "arg2"],
            };

            const opNoArgs = new Operation(paramsNoArgs);
            const opWithArgs = new Operation(paramsWithArgs);

            const params = { min_txfee_byte: 1024 };
            const costNoArgs = opNoArgs.calc_cost(params);
            const costWithArgs = opWithArgs.calc_cost(params);

            expect(costWithArgs).toBeGreaterThan(costNoArgs);
        });

        it("should scale cost with min_txfee_byte parameter", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
            };

            const op = new Operation(params);
            const cost1 = op.calc_cost({ min_txfee_byte: 1024 });
            const cost2 = op.calc_cost({ min_txfee_byte: 2048 });

            expect(cost2).toBe(cost1 * 2n);
        });
    });

    describe("hash_serialize", () => {
        it("should serialize without solution when full_hash is false", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const serialized = op.hash_serialize(false);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });

        it("should serialize with solution when full_hash is true", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const serialized = op.hash_serialize(true);

            expect(serialized).toBeInstanceOf(Uint8Array);
            expect(serialized.length).toBeGreaterThan(0);
        });
    });

    describe("getHashProxy", () => {
        it("should return proxy that transforms address field", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const proxy = op.getHashProxy();

            expect(proxy.address).toBeDefined();
            expect(proxy.address.constructor.name).toBe("addr_t");
            expect(proxy.address.toString()).toBe(params.address);
        });

        it("should return proxy that transforms args field to Variant array", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: ["arg1", "arg2"],
                user: null,
            };

            const op = new Operation(params);
            const proxy = op.getHashProxy();

            expect(Array.isArray(proxy.args)).toBe(true);
            expect(proxy.args.length).toBe(2);
        });

        it("should return proxy that wraps user in optional when user is present", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
                user: "mmx16aq5vpcmxcrh9xck0z06eqnmr87w5r2j062snjj6g7cvj0thry7q0mp3w6",
            };

            const op = new Operation(params);
            const proxy = op.getHashProxy();

            expect(proxy.user).toBeDefined();
            expect(proxy.user.constructor.name).toBe("optional");
            expect(proxy.user.valueOf().constructor.name).toBe("addr_t");
        });

        it("should return proxy that wraps null user in optional", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const proxy = op.getHashProxy();

            expect(proxy.user).toBeDefined();
            expect(proxy.user.constructor.name).toBe("optional");
            expect(proxy.user.valueOf()).toBeUndefined();
        });

        it("should return proxy that reflects other properties unchanged", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
                args: [],
                user: null,
            };

            const op = new Operation(params);
            const proxy = op.getHashProxy();

            expect(proxy.version).toBe(0);
            expect(proxy.method).toBe("withdraw");
        });
    });
});

describe("mmx.operation.Operation", () => {
    describe("constructor", () => {
        it("should throw error for invalid type", () => {
            expect(() => new Operation(Symbol("invalid type"))).toThrowError("Invalid Operation type");
        });

        it("should create Execute operation when __type is mmx.operation.Execute", () => {
            const params = {
                __type: "mmx.operation.Execute",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                method: "withdraw",
            };
            const op = new Operation(params);
            expect(op.__type).toBe("mmx.operation.Execute");
            expect(op.address).toBe(params.address);
        });

        it("should create Deposit operation when __type is mmx.operation.Deposit", () => {
            const params = {
                __type: "mmx.operation.Deposit",
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                currency: "mmx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdgytev",
                amount: "1000",
            };
            const op = new Operation(params);
            expect(op.__type).toBe("mmx.operation.Deposit");
            expect(op.currency).toBe(params.currency);
        });

        it("should create base Operation with address and solution", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 123,
            };
            const op = new Operation(params);
            expect(op.address).toBe(params.address);
            expect(op.solution).toBe(123);
        });

        it("should use NO_SOLUTION as default solution", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
            };
            const op = new Operation(params);
            expect(op.solution).toBe(Operation.NO_SOLUTION);
            expect(op.solution).toBe(65535);
        });
    });

    describe("toJSON", () => {
        it("should serialize base Operation to JSON", () => {
            const params = {
                address: "mmx1zmkneqqv28gyt8k8m3a09f2v2h3s0n44gly60hn5tq2d892re2asyh6g5x",
                solution: 100,
            };
            const op = new Operation(params);
            const json = op.toJSON();

            expect(json).toEqual({
                __type: "mmx.operation",
                version: 0,
                address: params.address,
                solution: 100,
            });
        });
    });

    describe("static constants", () => {
        it("should have NO_SOLUTION constant equal to 65535", () => {
            expect(Operation.NO_SOLUTION).toBe(65535);
        });
    });
});
