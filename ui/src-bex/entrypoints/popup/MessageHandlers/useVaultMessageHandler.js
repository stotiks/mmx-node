import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";

export const useVaultMessageHandler = () => {
    const $q = useQuasar();

    class VaultMessageHandlerMethods {
        static unlocked = async () => {
            $q.notify({ type: "positive", message: "Vault unlocked" });
        };

        static locked = async () => {
            $q.notify({ type: "positive", message: "Vault locked" });
        };

        static passwordUpdated = async () => {
            $q.notify({ type: "positive", message: "Password updated" });
        };

        static walletAdded = async () => {
            $q.notify({ type: "positive", message: "Wallet added" });
        };

        static walletRemoved = async () => {
            $q.notify({ type: "positive", message: "Wallet removed" });
        };

        static currentWalletChanged = async () => {
            console.log("currentWalletChanged");
        };
    }
    const vaultMessageHandler = new MessageHandler(VaultMessageHandlerMethods);
    vaultMessageHandler.register(popupMessenger.onMessage, "vault");
};
