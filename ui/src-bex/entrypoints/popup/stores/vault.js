import { ref, computed, onMounted } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useVaultService } from "../composables/useVaultService";

export const useVaultStore = defineStore("vaultStore", () => {
    const vaultService = useVaultService();

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    const isLoaded = ref(false);
    const isInitialized = ref(false);
    const isUnlocked = ref(false);

    const wallets = ref([]);
    const currentWalletAddress = ref("");

    const history = ref([]);

    const runningActionCount = ref(0);

    // -------------------------------------------------------------------------
    // Computed
    // -------------------------------------------------------------------------

    // Derived from runningActionCount — no watcher needed
    const isActionRunning = computed(() => runningActionCount.value !== 0);

    // History sorted by most-recent first — no sorting inside actions needed
    const sortedHistory = computed(() => [...history.value].sort((a, b) => b.timestamp - a.timestamp));

    // -------------------------------------------------------------------------
    // Loading helper
    // Wraps any async action so runningActionCount stays balanced even on error.
    // Replaces the fragile $onAction + recursive useVaultStore() self-reference.
    // -------------------------------------------------------------------------
    const withLoading =
        (fn) =>
        async (...args) => {
            runningActionCount.value++;
            try {
                return await fn(...args);
            } finally {
                runningActionCount.value--;
            }
        };

    // -------------------------------------------------------------------------
    // Internal refresh helpers
    // -------------------------------------------------------------------------
    const _refreshIsInitializedAsync = async () => {
        isInitialized.value = (await vaultService.getIsInitializedAsync()) ?? false;
    };

    const _refreshIsUnlockedAsync = async () => {
        isUnlocked.value = (await vaultService.getIsUnlockedAsync()) ?? false;
    };

    const _refreshWalletsAsync = async () => {
        const fetched = await vaultService.getWalletsAsync();
        wallets.value = fetched;

        // Keep currentWalletAddress consistent with the wallet list.
        // Done here (not in a watcher) to avoid cascading reactive cycles.
        if (fetched.length > 0) {
            if (!fetched.find((w) => w.address === currentWalletAddress.value)) {
                currentWalletAddress.value = fetched[0].address;
            }
        } else {
            currentWalletAddress.value = "";
        }
    };

    const _refreshCurrentWalletAddressAsync = async () => {
        if (isUnlocked.value) {
            currentWalletAddress.value = (await vaultService.getCurrentWalletAddressAsync()) ?? "";
        }
    };

    const _refreshHistoryAsync = async () => {
        history.value = await vaultService.getHistoryAsync();
    };

    // Runs all refresh operations. Independent fetches are parallelized.
    const _refresh = async () => {
        try {
            // Always fetch real state from background
            await Promise.all([_refreshIsInitializedAsync(), _refreshIsUnlockedAsync()]);

            if (isUnlocked.value) {
                await Promise.all([_refreshWalletsAsync(), _refreshCurrentWalletAddressAsync()]);
            }
        } catch (error) {
            console.error("[VaultStore] Refresh failed:", error);
        }
    };

    // -------------------------------------------------------------------------
    // Actions (public)
    // All exposed actions are wrapped with withLoading for consistent tracking.
    // -------------------------------------------------------------------------

    const lockAsync = withLoading(async () => {
        isUnlocked.value = (await vaultService.lockAsync()) ?? false;
        await _refresh();
    });

    const unlockAsync = withLoading(async ({ password }) => {
        isUnlocked.value = (await vaultService.unlockAsync({ password })) ?? false;
        await _refresh();
    });

    const updatePasswordAsync = withLoading(async ({ password, newPassword, rotateMasterKey }) => {
        await vaultService.updatePasswordAsync({ password, newPassword, rotateMasterKey });
    });

    const addWalletAsync = withLoading(async ({ mnemonic, password }) => {
        const newWallet = await vaultService.addWalletAsync({ mnemonic, password });
        await _refreshWalletsAsync();
        currentWalletAddress.value = newWallet.address;
        // Sync the new selection to the background
        await vaultService.setCurrentWalletByAddressAsync({ address: newWallet.address });
    });

    const removeWalletAsync = withLoading(async ({ address }) => {
        await vaultService.removeWalletAsync({ address });
        await _refreshWalletsAsync();
    });

    // NOTE: Users can delete all vault data at any time without password verification.
    // This is intentional - users should always have the ability to clear their local data,
    // even if they've forgotten their password. This is a "factory reset" operation.
    const clearAllAsync = withLoading(async () => {
        if (isUnlocked.value) {
            isUnlocked.value = (await vaultService.lockAsync()) ?? false;
        }
        await vaultService.clearAllAsync();
        await _refresh();
    });

    const initAsync = withLoading(async ({ password }) => {
        await vaultService.initAsync({ password });
        await _refresh();
    });

    // Sets the active wallet and syncs the selection to the background.
    // Components should call this action instead of writing currentWalletAddress directly.
    const setCurrentWalletAsync = withLoading(async ({ address }) => {
        if (isUnlocked.value && address !== currentWalletAddress.value) {
            await vaultService.setCurrentWalletByAddressAsync({ address });
            currentWalletAddress.value = address;
        }
    });

    const checkUrlPermissionsAsync = async (url) => {
        return await vaultService.checkUrlPermissionsAsync(url);
    };

    const allowUrlAsync = async (url) => {
        await vaultService.allowUrlAsync(url);
    };

    // Called by useVaultMessageHandler when the background signals a history update,
    // and by HistoryPage on mount.
    const updateHistoryAsync = withLoading(async () => {
        await _refreshHistoryAsync();
    });

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------
    onMounted(async () => {
        await _refresh();
        isLoaded.value = true;
    });

    return {
        // State
        isLoaded,
        isInitialized,
        isUnlocked,
        wallets,
        history,
        sortedHistory,
        currentWalletAddress,
        isActionRunning,
        runningActionCount,

        // Actions
        lockAsync,
        unlockAsync,
        updatePasswordAsync,
        addWalletAsync,
        removeWalletAsync,
        checkUrlPermissionsAsync,
        allowUrlAsync,
        clearAllAsync,
        initAsync,
        setCurrentWalletAsync,
        updateHistoryAsync,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVaultStore, import.meta.hot));
}
