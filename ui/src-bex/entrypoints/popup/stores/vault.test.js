import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

// ---------------------------------------------------------------------------
// Mock useVaultService so the store never touches real messaging.
// Use the relative path that vault.js resolves to at test time.
// ---------------------------------------------------------------------------
const mockVaultService = {
    getIsInitializedAsync: vi.fn(),
    getIsUnlockedAsync: vi.fn(),
    getWalletsAsync: vi.fn(),
    getCurrentWalletAddressAsync: vi.fn(),
    getHistoryAsync: vi.fn(),
    lockAsync: vi.fn(),
    unlockAsync: vi.fn(),
    updatePasswordAsync: vi.fn(),
    addWalletAsync: vi.fn(),
    removeWalletAsync: vi.fn(),
    clearAllAsync: vi.fn(),
    initAsync: vi.fn(),
    setCurrentWalletByAddressAsync: vi.fn(),
    checkUrlPermissionsAsync: vi.fn(),
    allowUrlAsync: vi.fn(),
};

vi.mock("../composables/useVaultService", () => ({
    useVaultService: () => mockVaultService,
}));

// Import store AFTER mock is registered
const { useVaultStore } = await import("./vault");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const WALLET_A = { address: "mmx1aaa" };
const WALLET_B = { address: "mmx1bbb" };

const defaultServiceState = () => {
    mockVaultService.getIsInitializedAsync.mockResolvedValue(false);
    mockVaultService.getIsUnlockedAsync.mockResolvedValue(false);
    mockVaultService.getWalletsAsync.mockResolvedValue([]);
    mockVaultService.getCurrentWalletAddressAsync.mockResolvedValue("");
    mockVaultService.getHistoryAsync.mockResolvedValue([]);
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("useVaultStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        defaultServiceState();
    });

    // -----------------------------------------------------------------------
    describe("initial state", () => {
        it("starts with isLoaded false before mount", () => {
            const store = useVaultStore();
            expect(store.isLoaded).toBe(false);
        });

        it("starts with isInitialized and isUnlocked false", () => {
            const store = useVaultStore();
            expect(store.isInitialized).toBe(false);
            expect(store.isUnlocked).toBe(false);
        });

        it("starts with empty wallets and empty currentWalletAddress", () => {
            const store = useVaultStore();
            expect(store.wallets).toEqual([]);
            expect(store.currentWalletAddress).toBe("");
        });

        it("starts with empty history and sortedHistory", () => {
            const store = useVaultStore();
            expect(store.history).toEqual([]);
            expect(store.sortedHistory).toEqual([]);
        });
    });

    // -----------------------------------------------------------------------
    describe("isActionRunning computed", () => {
        it("is false when runningActionCount is 0", () => {
            const store = useVaultStore();
            expect(store.isActionRunning).toBe(false);
        });

        it("is true when runningActionCount > 0", () => {
            const store = useVaultStore();
            store.runningActionCount = 1;
            expect(store.isActionRunning).toBe(true);
        });

        it("returns to false when runningActionCount drops back to 0", () => {
            const store = useVaultStore();
            store.runningActionCount = 2;
            expect(store.isActionRunning).toBe(true);
            store.runningActionCount = 0;
            expect(store.isActionRunning).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    describe("sortedHistory computed", () => {
        it("returns history sorted by timestamp descending", () => {
            const store = useVaultStore();
            store.history = [
                { timestamp: 100, message: null },
                { timestamp: 300, message: null },
                { timestamp: 200, message: null },
            ];
            expect(store.sortedHistory.map((h) => h.timestamp)).toEqual([300, 200, 100]);
        });

        it("does not mutate the original history ref", () => {
            const store = useVaultStore();
            store.history = [
                { timestamp: 100, message: null },
                { timestamp: 300, message: null },
            ];
            // Access sortedHistory
            store.sortedHistory;
            // Original order must be unchanged
            expect(store.history[0].timestamp).toBe(100);
        });
    });

    // -----------------------------------------------------------------------
    describe("lockAsync", () => {
        it("sets isUnlocked to false and calls _refresh", async () => {
            mockVaultService.lockAsync.mockResolvedValue(false);
            mockVaultService.getIsInitializedAsync.mockResolvedValue(true);
            mockVaultService.getIsUnlockedAsync.mockResolvedValue(false);

            const store = useVaultStore();
            store.isUnlocked = true;

            await store.lockAsync();

            expect(mockVaultService.lockAsync).toHaveBeenCalledOnce();
            expect(store.isUnlocked).toBe(false);
        });

        it("decrements runningActionCount after completion", async () => {
            mockVaultService.lockAsync.mockResolvedValue(false);
            const store = useVaultStore();

            await store.lockAsync();

            expect(store.runningActionCount).toBe(0);
        });

        it("decrements runningActionCount even when service throws", async () => {
            mockVaultService.lockAsync.mockRejectedValue(new Error("lock failed"));
            const store = useVaultStore();

            await expect(store.lockAsync()).rejects.toThrow("lock failed");
            expect(store.runningActionCount).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    describe("unlockAsync", () => {
        it("sets isUnlocked to true on success and refreshes state", async () => {
            mockVaultService.unlockAsync.mockResolvedValue(true);
            mockVaultService.getIsInitializedAsync.mockResolvedValue(true);
            mockVaultService.getIsUnlockedAsync.mockResolvedValue(true);
            mockVaultService.getWalletsAsync.mockResolvedValue([WALLET_A]);
            mockVaultService.getCurrentWalletAddressAsync.mockResolvedValue(WALLET_A.address);
            mockVaultService.getHistoryAsync.mockResolvedValue([]);

            const store = useVaultStore();
            await store.unlockAsync({ password: "secret" });

            expect(mockVaultService.unlockAsync).toHaveBeenCalledWith({ password: "secret" });
            expect(store.isUnlocked).toBe(true);
        });

        it("decrements runningActionCount after completion", async () => {
            mockVaultService.unlockAsync.mockResolvedValue(true);
            const store = useVaultStore();

            await store.unlockAsync({ password: "secret" });

            expect(store.runningActionCount).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    describe("addWalletAsync", () => {
        it("adds wallet and sets currentWalletAddress to new wallet", async () => {
            mockVaultService.addWalletAsync.mockResolvedValue(WALLET_B);
            mockVaultService.getWalletsAsync.mockResolvedValue([WALLET_A, WALLET_B]);
            mockVaultService.setCurrentWalletByAddressAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            store.wallets = [WALLET_A];
            store.currentWalletAddress = WALLET_A.address;

            await store.addWalletAsync({ mnemonic: "word1 word2", password: "pass" });

            expect(store.currentWalletAddress).toBe(WALLET_B.address);
            expect(mockVaultService.setCurrentWalletByAddressAsync).toHaveBeenCalledWith({
                address: WALLET_B.address,
            });
        });

        it("decrements runningActionCount after completion", async () => {
            mockVaultService.addWalletAsync.mockResolvedValue(WALLET_A);
            mockVaultService.getWalletsAsync.mockResolvedValue([WALLET_A]);
            mockVaultService.setCurrentWalletByAddressAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            await store.addWalletAsync({ mnemonic: "word1 word2", password: "pass" });

            expect(store.runningActionCount).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    describe("removeWalletAsync", () => {
        it("removes wallet and refreshes wallet list", async () => {
            mockVaultService.removeWalletAsync.mockResolvedValue(undefined);
            mockVaultService.getWalletsAsync.mockResolvedValue([WALLET_A]);

            const store = useVaultStore();
            store.wallets = [WALLET_A, WALLET_B];
            store.currentWalletAddress = WALLET_B.address;

            await store.removeWalletAsync({ address: WALLET_B.address });

            expect(mockVaultService.removeWalletAsync).toHaveBeenCalledWith({ address: WALLET_B.address });
            expect(store.wallets).toEqual([WALLET_A]);
        });

        it("resets currentWalletAddress to first wallet when removed wallet was current", async () => {
            mockVaultService.removeWalletAsync.mockResolvedValue(undefined);
            mockVaultService.getWalletsAsync.mockResolvedValue([WALLET_A]);

            const store = useVaultStore();
            store.wallets = [WALLET_A, WALLET_B];
            store.currentWalletAddress = WALLET_B.address;

            await store.removeWalletAsync({ address: WALLET_B.address });

            expect(store.currentWalletAddress).toBe(WALLET_A.address);
        });

        it("sets currentWalletAddress to empty string when all wallets removed", async () => {
            mockVaultService.removeWalletAsync.mockResolvedValue(undefined);
            mockVaultService.getWalletsAsync.mockResolvedValue([]);

            const store = useVaultStore();
            store.wallets = [WALLET_A];
            store.currentWalletAddress = WALLET_A.address;

            await store.removeWalletAsync({ address: WALLET_A.address });

            expect(store.currentWalletAddress).toBe("");
        });
    });

    // -----------------------------------------------------------------------
    describe("clearAllAsync", () => {
        it("locks vault first if currently unlocked", async () => {
            mockVaultService.lockAsync.mockResolvedValue(false);
            mockVaultService.clearAllAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            store.isUnlocked = true;

            await store.clearAllAsync();

            expect(mockVaultService.lockAsync).toHaveBeenCalledOnce();
            expect(mockVaultService.clearAllAsync).toHaveBeenCalledOnce();
        });

        it("does not call lockAsync if already locked", async () => {
            mockVaultService.clearAllAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            store.isUnlocked = false;

            await store.clearAllAsync();

            expect(mockVaultService.lockAsync).not.toHaveBeenCalled();
            expect(mockVaultService.clearAllAsync).toHaveBeenCalledOnce();
        });

        it("decrements runningActionCount after completion", async () => {
            mockVaultService.clearAllAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            await store.clearAllAsync();

            expect(store.runningActionCount).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    describe("setCurrentWalletAsync", () => {
        it("updates currentWalletAddress and syncs to background when unlocked", async () => {
            mockVaultService.setCurrentWalletByAddressAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            store.isUnlocked = true;
            store.currentWalletAddress = WALLET_A.address;

            await store.setCurrentWalletAsync({ address: WALLET_B.address });

            expect(mockVaultService.setCurrentWalletByAddressAsync).toHaveBeenCalledWith({
                address: WALLET_B.address,
            });
            expect(store.currentWalletAddress).toBe(WALLET_B.address);
        });

        it("does nothing when vault is locked", async () => {
            const store = useVaultStore();
            store.isUnlocked = false;
            store.currentWalletAddress = WALLET_A.address;

            await store.setCurrentWalletAsync({ address: WALLET_B.address });

            expect(mockVaultService.setCurrentWalletByAddressAsync).not.toHaveBeenCalled();
            expect(store.currentWalletAddress).toBe(WALLET_A.address);
        });

        it("does nothing when address is already current", async () => {
            const store = useVaultStore();
            store.isUnlocked = true;
            store.currentWalletAddress = WALLET_A.address;

            await store.setCurrentWalletAsync({ address: WALLET_A.address });

            expect(mockVaultService.setCurrentWalletByAddressAsync).not.toHaveBeenCalled();
        });
    });

    // -----------------------------------------------------------------------
    describe("updateHistoryAsync", () => {
        it("fetches history from service and updates history ref", async () => {
            const entries = [
                { timestamp: 200, message: null },
                { timestamp: 100, message: null },
            ];
            mockVaultService.getHistoryAsync.mockResolvedValue(entries);

            const store = useVaultStore();
            await store.updateHistoryAsync();

            expect(store.history).toEqual(entries);
        });
    });

    // -----------------------------------------------------------------------
    describe("updatePasswordAsync", () => {
        it("delegates to vaultService with correct params", async () => {
            mockVaultService.updatePasswordAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            await store.updatePasswordAsync({ password: "old", newPassword: "new", rotateMasterKey: false });

            expect(mockVaultService.updatePasswordAsync).toHaveBeenCalledWith({
                password: "old",
                newPassword: "new",
                rotateMasterKey: false,
            });
        });
    });

    // -----------------------------------------------------------------------
    describe("checkUrlPermissionsAsync", () => {
        it("returns result from vaultService", async () => {
            mockVaultService.checkUrlPermissionsAsync.mockResolvedValue(true);

            const store = useVaultStore();
            const result = await store.checkUrlPermissionsAsync("https://example.com");

            expect(result).toBe(true);
            expect(mockVaultService.checkUrlPermissionsAsync).toHaveBeenCalledWith("https://example.com");
        });
    });

    // -----------------------------------------------------------------------
    describe("allowUrlAsync", () => {
        it("delegates to vaultService", async () => {
            mockVaultService.allowUrlAsync.mockResolvedValue(undefined);

            const store = useVaultStore();
            await store.allowUrlAsync("https://example.com");

            expect(mockVaultService.allowUrlAsync).toHaveBeenCalledWith("https://example.com");
        });
    });
});
