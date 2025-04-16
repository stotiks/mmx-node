import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { internalMessenger } from "@bex/messaging/popup";

export const useVaultMessageHandler = () => {
    const $q = useQuasar();

    class VaultMessageHandler extends MessageHandlerBase {
        static unlocked = async () => {
            $q.notify({ type: "positive", message: "Vault unlocked" });
        };

        static locked = async () => {
            $q.notify({ type: "positive", message: "Vault locked" });
        };

        // static walletsLoaded = async () => {
        //     $q.notify({ type: "positive", message: "Wallets loaded" });
        // };

        static passwordUpdated = async () => {
            $q.notify({ type: "positive", message: "Password updated" });
        };
    }

    internalMessenger.onMessage("vault", async (message) => {
        return await VaultMessageHandler.handle(message);
    });
};
