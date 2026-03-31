import popupMessenger from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import { useQueryClient } from "@tanstack/vue-query";

export const useVaultMessageHandler = () => {
    const queryClient = useQueryClient();
    const $q = useQuasar();

    const showSuccessNotification = (message) => {
        $q.notify({ type: "positive", message });
    };

    const invalidateAllVaultQueries = () => {
        queryClient.invalidateQueries({ queryKey: ["vault"] });
    };

    const invalidateWalletQueries = () => {
        queryClient.invalidateQueries({ queryKey: ["vault", "wallets"] });
        queryClient.invalidateQueries({ queryKey: ["vault", "currentWallet"] });
    };

    const invalidateHistoryQuery = () => {
        queryClient.invalidateQueries({ queryKey: ["vault", "history"] });
    };

    const vaultMessageHandlerMethods = {
        unlocked: async () => {
            showSuccessNotification("Vault unlocked");
            invalidateAllVaultQueries();
        },

        locked: async () => {
            showSuccessNotification("Vault locked");
            invalidateAllVaultQueries();
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
            console.log("currentWalletChanged");
            queryClient.invalidateQueries({ queryKey: ["vault", "currentWallet"] });
        },
        permissionGranted: async () => {
            console.log("permissionGranted");
        },
        permissionRevoked: async () => {
            console.log("permissionRevoked");
        },
        historyUpdated: async () => {
            invalidateHistoryQuery();
        },
    };
    const vaultMessageHandler = new MessageHandler(vaultMessageHandlerMethods);

    const messageID = "popup/vault";
    vaultMessageHandler.register(popupMessenger.onMessage, messageID);
};
