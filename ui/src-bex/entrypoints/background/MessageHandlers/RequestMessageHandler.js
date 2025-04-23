import { Transaction } from "@/mmx/wallet/Transaction";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { getNodeInfo } from "../queries";
import vault from "../storage/vault";
import { notificationMessenger } from "../utils/notificationMessenger";
import { getCurrentWallet, getPubKeyAsync, signMessageAsync, signTransactionAsync } from "../utils/walletHelpers";

export class RequestMessageHandler extends MessageHandlerBase {
    static checkPermissionsAsync = async (message) => {
        console.log("Checking permissions...");
        console.log(message);

        await notificationMessenger.sendMessage({ method: "requestPermissions" });
        return true;
    };

    static async handleAsync(message) {
        const permitted = await this.checkPermissionsAsync(message);
        if (permitted) {
            return await super.handleAsync(message);
        } else {
            throw new Error("Permissions not granted");
        }
    }

    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestWallets = async () => {
        return await vault.getWallets();
    };

    static mmx_getCurrentWallet = async () => {
        return getCurrentWallet();
    };

    static mmx_getPubKey = async (params) => {
        return await getPubKeyAsync(params?.address);
    };

    static mmx_getNetwork = async () => {
        const network = await vault.getNetwork();
        return `MMX/${network}`;
    };

    static mmx_signMessage = async (message) => {
        return await signMessageAsync(message);
    };

    static mmx_signTransaction = async ({ tx }) => {
        let txObj;
        try {
            txObj = Transaction.parse(tx);
        } catch (error) {
            console.log(tx);
            console.log(error);
            throw new Error("Invalid transaction format");
        }

        return await signTransactionAsync(txObj);
    };

    static dev_test_openPopup = async () => {
        // await notificationMessenger.sendMessage("TODO");
        return "Done!";
    };
}
