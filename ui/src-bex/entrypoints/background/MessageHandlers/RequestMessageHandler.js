import { getNodeInfo } from "../queries";
import { notificationMessenger } from "../utils/notificationMessenger";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../Vault";

export class RequestMessageHandler extends MessageHandlerBase {
    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestAccounts = async () => {
        return await vault.getWallets();
    };

    static dev_test_openPopup = async () => {
        await notificationMessenger.sendMessage(1233453456);
        return "Done!";
    };
}
