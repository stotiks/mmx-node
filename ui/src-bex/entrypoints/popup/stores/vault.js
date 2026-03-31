import { ref, computed } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { useVaultService } from "../composables/useVaultService";

/**
 * Refactored Vault Store
 *
 * This store now focuses on orchestration and action management.
 * Data fetching has been migrated to TanStack Query for better caching,
 * background refetching, and query invalidation.
 *
 * The store maintains:
 * - Action orchestration (multi-step operations)
 * - Loading state via runningActionCount
 * - Backward compatibility for components still using store state
 */
export const useVaultStore = defineStore("vaultStore", () => {
    const vaultService = useVaultService();

    // -------------------------------------------------------------------------
    // State (minimal - for backward compatibility during transition)
    // -------------------------------------------------------------------------
    const isLoaded = ref(false);
    const runningActionCount = ref(0);

    // -------------------------------------------------------------------------
    // Computed
    // -------------------------------------------------------------------------
    const isActionRunning = computed(() => runningActionCount.value !== 0);

    // -------------------------------------------------------------------------
    // Loading helper
    // Wraps any async action so runningActionCount stays balanced even on error.
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
    // Actions (orchestration only - no data state management)
    // -------------------------------------------------------------------------

    const lockAsync = withLoading(async () => {
        return await vaultService.lockAsync();
    });

    const unlockAsync = withLoading(async ({ password }) => {
        return await vaultService.unlockAsync({ password });
    });

    const updatePasswordAsync = withLoading(async ({ password, newPassword, rotateMasterKey }) => {
        return await vaultService.updatePasswordAsync({ password, newPassword, rotateMasterKey });
    });

    const addWalletAsync = withLoading(async ({ mnemonic, password }) => {
        const newWallet = await vaultService.addWalletAsync({ mnemonic, password });
        // Sync the new selection to the background
        if (newWallet?.address) {
            await vaultService.setCurrentWalletByAddressAsync({ address: newWallet.address });
        }
        return newWallet;
    });

    const removeWalletAsync = withLoading(async ({ address }) => {
        return await vaultService.removeWalletAsync({ address });
    });

    // NOTE: Users can delete all vault data at any time without password verification.
    // This is intentional - users should always have the ability to clear their local data,
    // even if they've forgotten their password. This is a "factory reset" operation.
    const clearAllAsync = withLoading(async () => {
        const wasUnlocked = await vaultService.getIsUnlockedAsync();
        if (wasUnlocked) {
            await vaultService.lockAsync();
        }
        return await vaultService.clearAllAsync();
    });

    const initAsync = withLoading(async ({ password }) => {
        return await vaultService.initAsync({ password });
    });

    // Sets the active wallet and syncs the selection to the background.
    const setCurrentWalletAsync = withLoading(async ({ address }) => {
        if (address) {
            await vaultService.setCurrentWalletByAddressAsync({ address });
        }
    });

    const checkUrlPermissionsAsync = async (url) => {
        return await vaultService.checkUrlPermissionsAsync(url);
    };

    const allowUrlAsync = async (url) => {
        return await vaultService.allowUrlAsync(url);
    };

    // Called by useVaultMessageHandler when the background signals a history update.
    // Note: Components should use useHistoryQuery instead of this action.
    const updateHistoryAsync = withLoading(async () => {
        return await vaultService.getHistoryAsync();
    });

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------
    // Note: onMounted data fetching removed - TanStack Query handles this now.
    // Components using vault data should use the query hooks directly.
    isLoaded.value = true;

    return {
        // State
        isLoaded,
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
