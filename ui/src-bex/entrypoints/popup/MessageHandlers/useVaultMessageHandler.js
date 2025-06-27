import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";

export const useVaultMessageHandler = () => {
    const $q = useQuasar();

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
    };
    const vaultMessageHandler = new MessageHandler(vaultMessageHandlerMethods);
    vaultMessageHandler.register(popupMessenger.onMessage, "vault");
};
