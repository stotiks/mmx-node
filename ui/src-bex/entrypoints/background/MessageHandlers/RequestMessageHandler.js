import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { getNodeInfo } from "../queries";
import vault from "../storage/vault";
import { notificationMessenger } from "../utils/notificationMessenger";
import { getCurrentWalletAsync, getPubKeyAsync } from "../utils/walletHelpers";

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
        return await getCurrentWalletAsync();
    };

    static mmx_getPubKey = async (params) => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage(1233453456);
        }
        return await getPubKeyAsync(params?.address);
    };

    static mmx_getNetwork = async () => {
        return await vault.getNetwork();
    };

    static dev_test_openPopup = async () => {
        await notificationMessenger.sendMessage(1233453456);
        return "Done!";
    };
}
