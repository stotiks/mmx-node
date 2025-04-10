import { internalMessenger } from "@bex/utils/messaging";
import { getNodeInfo } from "../queries";
import { openNotification } from "../utils";
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
        try {
            await internalMessenger.sendMessage("notification", 123);
        } catch (e) {
            const popup = await openNotification();
            await internalMessenger.sendMessage("notification", 1233453456);
        }

        return "dev_test_openPopup";
    };
}
