import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";

import { useVaultStore } from "../stores/vault";

export const useVaultMessageHandler = () => {
    const $q = useQuasar();
    const vault = useVaultStore();

    const showSuccessNotification = (message) => {
        $q.notify({ type: "positive", message });
    };

    const vaultMessageHandlerMethods = {
        unlocked: async () => {
            showSuccessNotification("Vault unlocked");
        },

        locked: async () => {
            showSuccessNotification("Vault locked");
        },

        initialized: async () => {
            showSuccessNotification("Vault initialized");
        },

        passwordUpdated: async () => {
            showSuccessNotification("Password updated");
        },

        walletAdded: async () => {
            showSuccessNotification("Wallet added");
        },

        walletRemoved: async () => {
            showSuccessNotification("Wallet removed");
        },

        currentWalletChanged: async () => {
            console.log("currentWalletChanged");
        },
        permissionGranted: async () => {
            console.log("permissionGranted");
        },
        permissionRevoked: async () => {
            console.log("permissionRevoked");
        },
        historyUpdated: async () => {
            await vault.updateHistoryAsync();
        },
    };
    const vaultMessageHandler = new MessageHandler(vaultMessageHandlerMethods);
    vaultMessageHandler.register(popupMessenger.onMessage, "vault");
};
