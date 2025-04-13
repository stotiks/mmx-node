import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

const $q = useQuasar();

export class VaultMessageHandler extends MessageHandlerBase {
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
