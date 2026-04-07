import popupMessenger from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import { useQueryClient } from "@tanstack/vue-query";
import { vaultKeys } from "@bex/entrypoints/popup/queries/vaultKeys";

export const useVaultMessageHandler = () => {
    const queryClient = useQueryClient();
    const $q = useQuasar();

    const showSuccessNotification = (message) => {
        $q.notify({ type: "positive", message });
    };

    const invalidateAllVaultQueries = () => {
        queryClient.invalidateQueries({ queryKey: vaultKeys.all() });
    };

    const invalidateWalletQueries = () => {
        queryClient.invalidateQueries({ queryKey: vaultKeys.wallets() });
        queryClient.invalidateQueries({ queryKey: vaultKeys.currentWallet() });
    };

    const invalidateHistoryQuery = () => {
        queryClient.invalidateQueries({ queryKey: vaultKeys.history() });
    };

    const vaultMessageHandlerMethods = {
        unlocked: async () => {
            //showSuccessNotification("Vault unlocked");
            invalidateAllVaultQueries();
        },

        locked: async () => {
            //showSuccessNotification("Vault locked");

            invalidateAllVaultQueries();
            queryClient.removeQueries({ queryKey: vaultKeys.data() });
            queryClient.removeQueries({ queryKey: ["node"] });
            queryClient.removeQueries({ queryKey: ["node_info"] });
        },

        vaultRemoved: async () => {
            showSuccessNotification("Vault removed");
            invalidateAllVaultQueries();
            queryClient.removeQueries({ queryKey: vaultKeys.data() });
            queryClient.removeQueries({ queryKey: ["node"] });
            queryClient.removeQueries({ queryKey: ["node_info"] });
        },

        initialized: async () => {
            showSuccessNotification("Vault initialized");
            invalidateAllVaultQueries();
        },

        passwordUpdated: async () => {
            showSuccessNotification("Password updated");
        },

        walletAdded: async () => {
            showSuccessNotification("Wallet added");
            invalidateWalletQueries();
        },

        walletRemoved: async () => {
            showSuccessNotification("Wallet removed");
            invalidateWalletQueries();
        },

        currentWalletChanged: async () => {
            queryClient.invalidateQueries({ queryKey: vaultKeys.currentWallet() });
        },

        permissionGranted: async () => {},
        permissionRevoked: async () => {},

        historyUpdated: async () => {
            invalidateHistoryQuery();
        },
    };

    const vaultMessageHandler = new MessageHandler(vaultMessageHandlerMethods);
    vaultMessageHandler.register(popupMessenger.onMessage, "popup/vault");
};
