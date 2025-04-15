import { getNodeInfo } from "../queries";
import { notificationMessenger } from "../utils/notificationMessenger";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../storage/vault";

export class RequestMessageHandler extends MessageHandlerBase {
    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestWallets = async () => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage(1233453456);
        }
        return await vault.getWallets();
    };

    static mmx_requestCurrentWallet = async () => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage(1233453456);
        }
        return await vault.getCurrentWalletAsync();
    };

    static mmx_requestPubKey = async () => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage(1233453456);
        }
        return await vault.getPubKeyAsync();
    };

    static dev_test_openPopup = async () => {
        await notificationMessenger.sendMessage(1233453456);
        return "Done!";
    };
}
