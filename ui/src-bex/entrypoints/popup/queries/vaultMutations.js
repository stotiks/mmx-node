import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useVaultService } from "@bex/entrypoints/popup/composables/useVaultService";
import { vaultKeys } from "./vaultKeys";

/**
 * Creates a mutation for locking the vault.
 * Invalidates all vault queries on success.
 */
export const useLockMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.lockAsync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.all() });
        },
    });
};

/**
 * Creates a mutation for unlocking the vault.
 * Invalidates all vault queries on success to refresh wallet data.
 */
export const useUnlockMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password }) => vaultService.unlockAsync({ password }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.all() });
        },
    });
};

/**
 * Creates a mutation for updating the vault password.
 */
export const useUpdatePasswordMutation = () => {
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password, newPassword, rotateMasterKey }) =>
            vaultService.updatePasswordAsync({ password, newPassword, rotateMasterKey }),
    });
};

/**
 * Creates a mutation for initializing the vault.
 * Invalidates all vault queries on success.
 */
export const useInitVaultMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ password }) => vaultService.initAsync({ password }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.all() });
        },
    });
};

/**
 * Creates a mutation for adding a new wallet.
 * Invalidates wallets and current wallet queries on success.
 */
export const useAddWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ mnemonic, password }) => vaultService.addWalletAsync({ mnemonic, password }),
        onSuccess: (newWallet) => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.wallets() });
            queryClient.invalidateQueries({ queryKey: vaultKeys.currentWallet() });

            // Sync the new selection to the background
            if (newWallet?.address) {
                vaultService.setCurrentWalletByAddressAsync({ address: newWallet.address });
            }
        },
    });
};

/**
 * Creates a mutation for removing a wallet.
 * Invalidates wallets and current wallet queries on success.
 */
export const useRemoveWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ address }) => vaultService.removeWalletAsync({ address }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.wallets() });
            queryClient.invalidateQueries({ queryKey: vaultKeys.currentWallet() });
        },
    });
};

/**
 * Creates a mutation for clearing all vault data.
 * Invalidates all vault queries on success.
 */
export const useClearVaultMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.clearAllAsync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.all() });
        },
    });
};

/**
 * Creates a mutation for setting the current wallet.
 * Updates the current wallet query cache directly for instant UI feedback.
 */
export const useSetCurrentWalletMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: ({ address }) => vaultService.setCurrentWalletByAddressAsync({ address }),
        onSuccess: (_, { address }) => {
            queryClient.setQueryData(vaultKeys.currentWallet(), address);
        },
    });
};

/**
 * Creates a mutation for allowing URL permissions.
 * Invalidates the URL permissions query for the given URL on success.
 */
export const useAllowUrlMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: (url) => vaultService.allowUrlAsync(url),
        onSuccess: (_, url) => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.urlPermissions(url) });
        },
    });
};

/**
 * Creates a mutation for refreshing history (triggered by message handler).
 * Updates the history query cache directly with the fetched data.
 */
export const useUpdateHistoryMutation = () => {
    const queryClient = useQueryClient();
    const vaultService = useVaultService();

    return useMutation({
        mutationFn: () => vaultService.getHistoryAsync(),
        onSuccess: (data) => {
            queryClient.setQueryData(vaultKeys.history(), data);
        },
    });
};
