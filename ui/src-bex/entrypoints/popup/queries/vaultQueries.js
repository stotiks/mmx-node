import { useQuery } from "@tanstack/vue-query";
import { useVaultService } from "@bex/entrypoints/popup/composables/useVaultService";
import { vaultKeys } from "./vaultKeys";

/**
 * Query to fetch all wallets from the vault
 * Returns array of wallet objects with address and other metadata
 */
export const useWalletsQuery = () => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.wallets(),
        queryFn: () => vaultService.getWalletsAsync(),
        // placeholderData: [],
    });
};

/**
 * Query to fetch the current wallet address
 * Only runs when vault is unlocked
 * @param {import("vue").Ref<boolean>} isUnlocked - Reactive ref indicating vault unlock state
 */
export const useCurrentWalletQuery = (isUnlocked) => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.currentWallet(),
        queryFn: () => vaultService.getCurrentWalletAddressAsync(),
        enabled: isUnlocked,
        placeholderData: "",
    });
};

/**
 * Query to fetch transaction history from the vault
 * Always fresh - no caching for history
 */
export const useHistoryQuery = () => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.history(),
        queryFn: () => vaultService.getHistoryAsync(),
        placeholderData: [],
    });
};

/**
 * Query to check if vault is initialized
 */
export const useIsInitializedQuery = () => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.isInitialized(),
        queryFn: () => vaultService.getIsInitializedAsync(),
        placeholderData: false,
    });
};

/**
 * Query to check if vault is unlocked
 */
export const useIsUnlockedQuery = () => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.isUnlocked(),
        queryFn: () => vaultService.getIsUnlockedAsync(),
        placeholderData: false,
    });
};

/**
 * Combined query hook for vault status (initialized + unlocked).
 * Returns reactive computed refs for isLoading and isError so consumers
 * always reflect the latest state rather than a one-time snapshot.
 */
export const useVaultStatusQuery = () => {
    const isInitializedQuery = useIsInitializedQuery();
    const isUnlockedQuery = useIsUnlockedQuery();

    return {
        isInitialized: isInitializedQuery.data,
        isUnlocked: isUnlockedQuery.data,
        isLoading: computed(() => isInitializedQuery.isLoading.value || isUnlockedQuery.isLoading.value),
        isError: computed(() => isInitializedQuery.isError.value || isUnlockedQuery.isError.value),
        error: computed(() => isInitializedQuery.error.value || isUnlockedQuery.error.value),
    };
};

/**
 * Query to check URL permissions
 * @param {string | import("vue").Ref<string>} url - URL to check permissions for
 */
export const useUrlPermissionsQuery = (url) => {
    const vaultService = useVaultService();

    return useQuery({
        queryKey: vaultKeys.urlPermissions(url),
        queryFn: () => vaultService.checkUrlPermissionsAsync(url),
        enabled: !!url,
        placeholderData: false,
    });
};
