import { notificationMessenger } from "../notificationMessenger";
import { getNodeInfo } from "../queries";
import vault from "../Vault";
import { MessageHandlerBase } from "./MessageHandlerBase";

export class RequestMessageHandler extends MessageHandlerBase {
    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestAccounts = async () => {
        return await vault.getWalletsAddresses();
    };

    static dev_test_openPopup = async () => {
        await notificationMessenger.sendMessage(1233453456);
        return "Done!";
    };
}
