import { useQuery } from "@tanstack/vue-query";
import { useVaultService } from "@bex/entrypoints/popup/composables/useVaultService";

/**
 * Query to fetch all wallets from the vault
 * Returns array of wallet objects with address and other metadata
 */
export const useWalletsQuery = () => {
    const vaultService = useVaultService();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "wallets"],
        queryFn: () => vaultService.getWalletsAsync(),
        staleTime: 1000 * 60 * 5, // 5 minutes - wallets don't change often
        gcTime: 1000 * 60 * 10, // 10 minutes
        placeholderData: [],
    });
};

/**
 * Query to fetch the current wallet address
 * Only returns data when vault is unlocked
 */
export const useCurrentWalletQuery = (isUnlocked) => {
    const vaultService = useVaultService();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "currentWallet"],
        queryFn: () => vaultService.getCurrentWalletAddressAsync(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
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

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "history"],
        queryFn: () => vaultService.getHistoryAsync(),
        staleTime: 0, // Always fetch fresh
        gcTime: 1000 * 60 * 10, // 10 minutes
        placeholderData: [],
    });
};

/**
 * Query to check if vault is initialized
 */
export const useIsInitializedQuery = () => {
    const vaultService = useVaultService();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "isInitialized"],
        queryFn: () => vaultService.getIsInitializedAsync(),
        staleTime: 1000 * 60, // 1 minute
        gcTime: 1000 * 60 * 5, // 5 minutes
        placeholderData: false,
    });
};

/**
 * Query to check if vault is unlocked
 */
export const useIsUnlockedQuery = () => {
    const vaultService = useVaultService();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "isUnlocked"],
        queryFn: () => vaultService.getIsUnlockedAsync(),
        staleTime: 0, // Always check - security critical
        gcTime: 1000 * 60 * 5, // 5 minutes
        placeholderData: false,
    });
};

/**
 * Combined query hook for vault status (initialized + unlocked)
 * Useful for pages that need both status checks
 */
export const useVaultStatusQuery = () => {
    const isInitializedQuery = useIsInitializedQuery();
    const isUnlockedQuery = useIsUnlockedQuery();

    return {
        isInitialized: isInitializedQuery.data,
        isUnlocked: isUnlockedQuery.data,
        isLoading: isInitializedQuery.isLoading.value || isUnlockedQuery.isLoading.value,
        isError: isInitializedQuery.isError.value || isUnlockedQuery.isError.value,
        error: isInitializedQuery.error.value || isUnlockedQuery.error.value,
    };
};

/**
 * Query to check URL permissions
 */
export const useUrlPermissionsQuery = (url) => {
    const vaultService = useVaultService();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- vaultService is a stable singleton
    return useQuery({
        queryKey: ["vault", "urlPermissions", url],
        queryFn: () => vaultService.checkUrlPermissionsAsync(url),
        enabled: !!url,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        placeholderData: false,
    });
};
