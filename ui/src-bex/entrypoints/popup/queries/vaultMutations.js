import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useVaultService } from "@bex/entrypoints/popup/composables/useVaultService";

/**
 * Creates a mutation for locking the vault
 * Invalidates all vault queries on success
 */
export const useLockMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.lockAsync(),
        onSuccess: () => {
            // Invalidate all vault queries
            queryClient.invalidateQueries({ queryKey: ["vault"] });
        },
    });
};

/**
 * Creates a mutation for unlocking the vault
 * Invalidates all vault queries on success
 */
export const useUnlockMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password }) => vaultService.unlockAsync({ password }),
        onSuccess: () => {
            // Invalidate all vault queries to refresh wallet data
            queryClient.invalidateQueries({ queryKey: ["vault"] });
        },
    });
};

/**
 * Creates a mutation for updating the vault password
 */
export const useUpdatePasswordMutation = () => {
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password, newPassword, rotateMasterKey }) =>
            vaultService.updatePasswordAsync({ password, newPassword, rotateMasterKey }),
    });
};

/**
 * Creates a mutation for initializing the vault
 * Invalidates all vault queries on success
 */
export const useInitVaultMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password }) => vaultService.initAsync({ password }),
        onSuccess: () => {
            // Invalidate all vault queries
            queryClient.invalidateQueries({ queryKey: ["vault"] });
        },
    });
};

/**
 * Creates a mutation for adding a new wallet
 * Invalidates wallets and current wallet queries on success
 */
export const useAddWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ mnemonic, password }) => vaultService.addWalletAsync({ mnemonic, password }),
        onSuccess: (newWallet) => {
            // Invalidate wallet queries
            queryClient.invalidateQueries({ queryKey: ["vault", "wallets"] });
            queryClient.invalidateQueries({ queryKey: ["vault", "currentWallet"] });

            // Sync the new selection to the background
            if (newWallet?.address) {
                vaultService.setCurrentWalletByAddressAsync({ address: newWallet.address });
            }
        },
    });
};

/**
 * Creates a mutation for removing a wallet
 * Invalidates wallets query on success
 */
export const useRemoveWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ address }) => vaultService.removeWalletAsync({ address }),
        onSuccess: () => {
            // Invalidate wallet queries
            queryClient.invalidateQueries({ queryKey: ["vault", "wallets"] });
            queryClient.invalidateQueries({ queryKey: ["vault", "currentWallet"] });
        },
    });
};

/**
 * Creates a mutation for clearing all vault data
 * Invalidates all vault queries on success
 */
export const useClearVaultMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.clearAllAsync(),
        onSuccess: () => {
            // Invalidate all vault queries
            queryClient.invalidateQueries({ queryKey: ["vault"] });
        },
    });
};

/**
 * Creates a mutation for setting the current wallet
 * Updates the current wallet query directly
 */
export const useSetCurrentWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ address }) => vaultService.setCurrentWalletByAddressAsync({ address }),
        onSuccess: (_, { address }) => {
            // Update the current wallet query
            queryClient.setQueryData(["vault", "currentWallet"], address);
        },
    });
};

/**
 * Creates a mutation for allowing URL permissions
 * Invalidates URL permissions query on success
 */
export const useAllowUrlMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: (url) => vaultService.allowUrlAsync(url),
        onSuccess: (_, url) => {
            // Invalidate the URL permissions query
            queryClient.invalidateQueries({ queryKey: ["vault", "urlPermissions", url] });
        },
    });
};

/**
 * Creates a mutation for updating history (triggered by message handler)
 * Invalidates history query
 */
export const useUpdateHistoryMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.getHistoryAsync(),
        onSuccess: (data) => {
            // Update the history query directly
            queryClient.setQueryData(["vault", "history"], data);
        },
    });
};
