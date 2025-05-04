import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export const useVaultMessageHandler = () => {
    const $q = useQuasar();

    class VaultMessageHandler extends MessageHandlerBase {
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
    }
    const vaultMessageHandler = new MessageHandlerBase(VaultMessageHandler);
    vaultMessageHandler.register(popupMessenger.onMessage, "vault");
};
