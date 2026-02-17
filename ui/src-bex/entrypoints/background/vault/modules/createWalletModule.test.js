import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWalletModule } from "./createWalletModule";
import { base64 } from "@scure/base";

// Mock the ECDSA_Wallet and mnemonic modules
let mockECDSAWallet;
vi.mock("@/mmx/wallet/ECDSA_Wallet", () => ({
    ECDSA_Wallet: class MockECDSAWallet {
        constructor(mnemonic, password) {
            this.mnemonic = mnemonic;
            this.password = password;
            // Allow tests to inject behavior
            if (mockECDSAWallet) {
                Object.assign(this, mockECDSAWallet);
            }
        }
        async getAddressAsync(index) {
            return mockECDSAWallet?.getAddressAsync?.(index) ?? "mmx1default";
        }
    },
}));

let mockMnemonicToSeed;
vi.mock("@/mmx/wallet/mnemonic", () => ({
    mnemonicToSeed: (mnemonic) => {
        return mockMnemonicToSeed?.(mnemonic) ?? new Uint8Array([1, 2, 3, 4, 5]);
    },
}));

describe("createWalletModule", () => {
    const createMockWalletBoundStorage = () => {
        let storedData = { wallets: [] };

        return {
            getAsync: vi.fn(async () => ({ ...storedData })),
            setAsync: vi.fn(async (data) => {
                storedData = { ...data };
            }),
            _setData: (data) => {
                storedData = data;
            },
            _getData: () => storedData,
            _clear: () => {
                storedData = { wallets: [] };
            },
        };
    };

    const createMockEventModule = () => {
        const events = [];
        const listeners = new Map();

        return {
            emit: vi.fn((name, payload) => {
                events.push({ name, payload });
                // Trigger any registered listeners
                const eventListeners = listeners.get(name) || [];
                eventListeners.forEach((listener) => listener(payload));
            }),
            on: vi.fn((name, callback) => {
                if (!listeners.has(name)) {
                    listeners.set(name, []);
                }
                listeners.get(name).push(callback);
            }),
            getEvents: () => events,
            _clear: () => {
                events.length = 0;
                listeners.clear();
            },
        };
    };

    const createDeps = (overrides = {}) => {
        const walletBoundStorage = createMockWalletBoundStorage();
        const eventModule = createMockEventModule();
        const requireUnlocked = vi.fn(); // Mock requireUnlocked function

        return {
            walletBoundStorage,
            eventModule,
            requireUnlocked,
            ...overrides,
        };
    };

    const setupMockECDSAWallet = (address = "mmx1test123") => {
        mockECDSAWallet = {
            getAddressAsync: vi.fn(async () => address),
        };
        return mockECDSAWallet;
    };

    const setupMockMnemonicToSeed = (seed = new Uint8Array([1, 2, 3, 4, 5])) => {
        mockMnemonicToSeed = vi.fn(() => seed);
        return seed;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockECDSAWallet = null;
        mockMnemonicToSeed = null;
    });

    describe("getNetworkAsync", () => {
        it("returns 'mainnet'", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            const network = await module.getNetworkAsync();

            expect(network).toBe("mainnet");
        });
    });

    describe("walletCleanup", () => {
        it("removes sensitive fields from wallet object", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            // Access internal function by testing through getWalletsAsync
            deps.walletBoundStorage._setData({
                wallets: [
                    {
                        address: "mmx1test123",
                        seed: "base64seed",
                        password: "secret",
                        extraField: "value",
                    },
                ],
            });

            // The cleanup is tested indirectly through getWalletsAsync
            const wallets = await module.getWalletsAsync();

            expect(wallets).toEqual([
                {
                    address: "mmx1test123",
                    extraField: "value",
                },
            ]);
        });
    });

    describe("getWalletsAsync", () => {
        it("returns empty array when no wallets exist", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            const wallets = await module.getWalletsAsync();

            expect(wallets).toEqual([]);
        });

        it("returns wallets without sensitive data", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [
                    {
                        address: "mmx1wallet1",
                        seed: "seed1",
                        password: "pass1",
                    },
                    {
                        address: "mmx1wallet2",
                        seed: "seed2",
                        password: "pass2",
                    },
                ],
            });
            const module = createWalletModule(deps);

            const wallets = await module.getWalletsAsync();

            expect(wallets).toEqual([{ address: "mmx1wallet1" }, { address: "mmx1wallet2" }]);
            expect(wallets[0]).not.toHaveProperty("seed");
            expect(wallets[0]).not.toHaveProperty("password");
        });

        it("handles undefined wallets data gracefully", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({});
            const module = createWalletModule(deps);

            const wallets = await module.getWalletsAsync();

            expect(wallets).toEqual([]);
        });
    });

    describe("addWalletAsync", () => {
        it("creates and adds a new wallet", async () => {
            const deps = createDeps();
            const mockWallet = setupMockECDSAWallet("mmx1newwallet");
            const mockSeed = setupMockMnemonicToSeed();
            const module = createWalletModule(deps);

            const mnemonic = "test mnemonic phrase";
            const password = "mypassword";

            const result = await module.addWalletAsync({ mnemonic, password });

            expect(mockWallet.getAddressAsync).toHaveBeenCalledWith(0);
            expect(mockMnemonicToSeed).toHaveBeenCalledWith(mnemonic);
            expect(result).toEqual({ address: "mmx1newwallet" });
            expect(result).not.toHaveProperty("seed");
            expect(result).not.toHaveProperty("password");
        });

        it("stores wallet with encoded seed and password", async () => {
            const deps = createDeps();
            const mockSeed = new Uint8Array([1, 2, 3, 4, 5]);
            setupMockECDSAWallet("mmx1newwallet");
            setupMockMnemonicToSeed(mockSeed);
            const module = createWalletModule(deps);

            const mnemonic = "test mnemonic phrase";
            const password = "mypassword";

            await module.addWalletAsync({ mnemonic, password });

            expect(deps.walletBoundStorage.setAsync).toHaveBeenCalledWith({
                wallets: [
                    {
                        address: "mmx1newwallet",
                        seed: base64.encode(mockSeed),
                        password: "mypassword",
                    },
                ],
            });
        });

        it("throws error when wallet with same address already exists", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [
                    {
                        address: "mmx1existing",
                        seed: "seed",
                        password: "pass",
                    },
                ],
            });
            setupMockECDSAWallet("mmx1existing");
            setupMockMnemonicToSeed();
            const module = createWalletModule(deps);

            await expect(
                module.addWalletAsync({
                    mnemonic: "test mnemonic",
                    password: "password",
                })
            ).rejects.toThrow("Wallet already exists");
        });

        it("emits 'wallet-added' event with address", async () => {
            const deps = createDeps();
            setupMockECDSAWallet("mmx1newwallet");
            setupMockMnemonicToSeed();
            const module = createWalletModule(deps);

            await module.addWalletAsync({
                mnemonic: "test mnemonic",
                password: "password",
            });

            expect(deps.eventModule.emit).toHaveBeenCalledWith("wallet-added", {
                address: "mmx1newwallet",
            });
        });

        it("adds multiple wallets successfully", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            setupMockECDSAWallet("mmx1wallet1");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({
                mnemonic: "mnemonic1",
                password: "pass1",
            });

            setupMockECDSAWallet("mmx1wallet2");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({
                mnemonic: "mnemonic2",
                password: "pass2",
            });

            const wallets = await module.getWalletsAsync();
            expect(wallets).toHaveLength(2);
            expect(wallets[0].address).toBe("mmx1wallet1");
            expect(wallets[1].address).toBe("mmx1wallet2");
        });
    });

    describe("removeWalletAsync", () => {
        it("removes wallet by address", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [
                    { address: "mmx1wallet1", seed: "seed1", password: "pass1" },
                    { address: "mmx1wallet2", seed: "seed2", password: "pass2" },
                ],
            });
            const module = createWalletModule(deps);

            await module.removeWalletAsync({ address: "mmx1wallet1" });

            const wallets = await module.getWalletsAsync();
            expect(wallets).toHaveLength(1);
            expect(wallets[0].address).toBe("mmx1wallet2");
        });

        it("throws error when wallet not found", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await expect(module.removeWalletAsync({ address: "mmx1nonexistent" })).rejects.toThrow("Wallet not found");
        });

        it("emits 'wallet-removed' event with address", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await module.removeWalletAsync({ address: "mmx1wallet1" });

            expect(deps.eventModule.emit).toHaveBeenCalledWith("wallet-removed", {
                address: "mmx1wallet1",
            });
        });

        it("updates storage after removal", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [
                    { address: "mmx1wallet1", seed: "seed1", password: "pass1" },
                    { address: "mmx1wallet2", seed: "seed2", password: "pass2" },
                ],
            });
            const module = createWalletModule(deps);

            await module.removeWalletAsync({ address: "mmx1wallet1" });

            expect(deps.walletBoundStorage.setAsync).toHaveBeenCalledWith({
                wallets: [{ address: "mmx1wallet2", seed: "seed2", password: "pass2" }],
            });
        });
    });

    describe("getCurrentWalletAddress", () => {
        it("returns null initially", () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            const address = module.getCurrentWalletAddress();

            expect(address).toBeNull();
        });

        it("returns current wallet address after setting", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });

            expect(module.getCurrentWalletAddress()).toBe("mmx1wallet1");
        });
    });

    describe("setCurrentWalletByAddressAsync", () => {
        it("sets current wallet address", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });

            expect(module.getCurrentWalletAddress()).toBe("mmx1wallet1");
        });

        it("throws error when wallet not found", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await expect(module.setCurrentWalletByAddressAsync({ address: "mmx1nonexistent" })).rejects.toThrow(
                "Wallet with address mmx1nonexistent not found"
            );
        });

        it("allows setting address to null", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });
            await module.setCurrentWalletByAddressAsync({ address: null });

            expect(module.getCurrentWalletAddress()).toBeNull();
        });

        it("allows setting address to undefined", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: undefined });

            expect(module.getCurrentWalletAddress()).toBeUndefined();
        });

        it("emits 'current-wallet-changed' event", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });

            expect(deps.eventModule.emit).toHaveBeenCalledWith("current-wallet-changed", {
                address: "mmx1wallet1",
            });
        });

        it("emits event even when setting to null", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            await module.setCurrentWalletByAddressAsync({ address: null });

            expect(deps.eventModule.emit).toHaveBeenCalledWith("current-wallet-changed", {
                address: null,
            });
        });
    });

    describe("getECDSAWalletAsync", () => {
        it("throws error when no address provided", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            await expect(module.getECDSAWalletAsync({ address: null })).rejects.toThrow("No wallet selected");

            await expect(module.getECDSAWalletAsync({ address: undefined })).rejects.toThrow("No wallet selected");

            await expect(module.getECDSAWalletAsync({ address: "" })).rejects.toThrow("No wallet selected");
        });

        it("throws error when wallet not found", async () => {
            const deps = createDeps();
            deps.walletBoundStorage._setData({
                wallets: [{ address: "mmx1wallet1", seed: "seed1", password: "pass1" }],
            });
            const module = createWalletModule(deps);

            await expect(module.getECDSAWalletAsync({ address: "mmx1nonexistent" })).rejects.toThrow(
                "Wallet not found for address: mmx1nonexistent"
            );
        });

        it("creates ECDSA wallet with decoded seed and password", async () => {
            const deps = createDeps();
            const mockSeed = new Uint8Array([1, 2, 3, 4, 5]);
            const encodedSeed = base64.encode(mockSeed);
            deps.walletBoundStorage._setData({
                wallets: [
                    {
                        address: "mmx1wallet1",
                        seed: encodedSeed,
                        password: "mypassword",
                    },
                ],
            });
            const module = createWalletModule(deps);

            const wallet = await module.getECDSAWalletAsync({ address: "mmx1wallet1" });

            expect(wallet).toBeDefined();
            expect(wallet.mnemonic).toEqual(mockSeed);
            expect(wallet.password).toBe("mypassword");
        });

        it("returns different wallet instances for different addresses", async () => {
            const deps = createDeps();
            const seed1 = base64.encode(new Uint8Array([1, 2, 3]));
            const seed2 = base64.encode(new Uint8Array([4, 5, 6]));
            deps.walletBoundStorage._setData({
                wallets: [
                    { address: "mmx1wallet1", seed: seed1, password: "pass1" },
                    { address: "mmx1wallet2", seed: seed2, password: "pass2" },
                ],
            });

            const module = createWalletModule(deps);

            const wallet1 = await module.getECDSAWalletAsync({ address: "mmx1wallet1" });
            const wallet2 = await module.getECDSAWalletAsync({ address: "mmx1wallet2" });

            expect(wallet1).toBeDefined();
            expect(wallet2).toBeDefined();
            expect(wallet1.mnemonic).toEqual(new Uint8Array([1, 2, 3]));
            expect(wallet1.password).toBe("pass1");
            expect(wallet2.mnemonic).toEqual(new Uint8Array([4, 5, 6]));
            expect(wallet2.password).toBe("pass2");
        });
    });

    describe("module exports", () => {
        it("exports all expected methods", () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            expect(module).toHaveProperty("getNetworkAsync");
            expect(module).toHaveProperty("getWalletsAsync");
            expect(module).toHaveProperty("addWalletAsync");
            expect(module).toHaveProperty("removeWalletAsync");
            expect(module).toHaveProperty("getCurrentWalletAddress");
            expect(module).toHaveProperty("setCurrentWalletByAddressAsync");
            expect(module).toHaveProperty("getECDSAWalletAsync");

            expect(typeof module.getNetworkAsync).toBe("function");
            expect(typeof module.getWalletsAsync).toBe("function");
            expect(typeof module.addWalletAsync).toBe("function");
            expect(typeof module.removeWalletAsync).toBe("function");
            expect(typeof module.getCurrentWalletAddress).toBe("function");
            expect(typeof module.setCurrentWalletByAddressAsync).toBe("function");
            expect(typeof module.getECDSAWalletAsync).toBe("function");
        });

        it("does not expose internal sensitive methods", () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            expect(module).not.toHaveProperty("getWalletsAsync$$sensitive");
            expect(module).not.toHaveProperty("walletCleanup");
        });
    });

    describe("integration workflows", () => {
        it("handles complete wallet lifecycle: add -> set current -> get ECDSA -> remove", async () => {
            const deps = createDeps();
            const mockSeed = new Uint8Array([1, 2, 3, 4, 5]);
            setupMockECDSAWallet("mmx1wallet1");
            setupMockMnemonicToSeed(mockSeed);
            const module = createWalletModule(deps);

            // Add wallet
            const addedWallet = await module.addWalletAsync({
                mnemonic: "test mnemonic",
                password: "password",
            });
            expect(addedWallet.address).toBe("mmx1wallet1");

            // Set as current
            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });
            expect(module.getCurrentWalletAddress()).toBe("mmx1wallet1");

            // Get ECDSA wallet
            const ecdsaWallet = await module.getECDSAWalletAsync({ address: "mmx1wallet1" });
            expect(ecdsaWallet).toBeDefined();

            // Remove wallet
            await module.removeWalletAsync({ address: "mmx1wallet1" });
            const wallets = await module.getWalletsAsync();
            expect(wallets).toHaveLength(0);

            // Events emitted
            const events = deps.eventModule.getEvents();
            expect(events.map((e) => e.name)).toEqual(["wallet-added", "current-wallet-changed", "wallet-removed"]);
        });

        it("handles multiple wallets with current wallet switching", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            // Add first wallet
            setupMockECDSAWallet("mmx1wallet1");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({
                mnemonic: "mnemonic1",
                password: "pass1",
            });

            // Add second wallet
            setupMockECDSAWallet("mmx1wallet2");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({
                mnemonic: "mnemonic2",
                password: "pass2",
            });

            // Set first as current
            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet1" });
            expect(module.getCurrentWalletAddress()).toBe("mmx1wallet1");

            // Switch to second
            await module.setCurrentWalletByAddressAsync({ address: "mmx1wallet2" });
            expect(module.getCurrentWalletAddress()).toBe("mmx1wallet2");

            // Verify both wallets exist
            const wallets = await module.getWalletsAsync();
            expect(wallets).toHaveLength(2);
        });
    });

    describe("edge cases", () => {
        it("handles empty dependencies object", () => {
            expect(() => createWalletModule({})).not.toThrow();
        });

        it("handles undefined dependencies", () => {
            expect(() => createWalletModule()).not.toThrow();
        });

        it("getWalletsAsync handles null data from storage", async () => {
            const deps = createDeps();
            deps.walletBoundStorage.getAsync = vi.fn(async () => null);
            const module = createWalletModule(deps);

            const wallets = await module.getWalletsAsync();

            expect(wallets).toEqual([]);
        });

        it("preserves wallet order", async () => {
            const deps = createDeps();
            const module = createWalletModule(deps);

            setupMockECDSAWallet("mmx1wallet1");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({ mnemonic: "m1", password: "p1" });

            setupMockECDSAWallet("mmx1wallet2");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({ mnemonic: "m2", password: "p2" });

            setupMockECDSAWallet("mmx1wallet3");
            setupMockMnemonicToSeed();
            await module.addWalletAsync({ mnemonic: "m3", password: "p3" });

            const wallets = await module.getWalletsAsync();
            expect(wallets[0].address).toBe("mmx1wallet1");
            expect(wallets[1].address).toBe("mmx1wallet2");
            expect(wallets[2].address).toBe("mmx1wallet3");
        });
    });
});
