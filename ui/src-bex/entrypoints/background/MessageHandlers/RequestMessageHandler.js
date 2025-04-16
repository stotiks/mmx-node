import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { getNodeInfo } from "../queries";
import vault from "../storage/vault";
import { notificationMessenger } from "../utils/notificationMessenger";
import { getCurrentWallet, getPubKeyAsync, signMessageAsync, signTransactionAsync } from "../utils/walletHelpers";
import { Transaction } from "@/mmx/wallet/Transaction";

export class RequestMessageHandler extends MessageHandlerBase {
    static mmx_blockNumber = async () => {
        const info = await getNodeInfo();
        return info.height;
    };

    static mmx_requestWallets = async () => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage("TODO");
        }
        return await vault.getWallets();
    };

    static mmx_getCurrentWallet = async () => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage("TODO");
        }
        return getCurrentWallet();
    };

    static mmx_getPubKey = async (params) => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage("TODO");
        }
        return await getPubKeyAsync(params?.address);
    };

    static mmx_getNetwork = async () => {
        const network = await vault.getNetwork();
        return `MMX/${network}`;
    };

    static mmx_signMessage = async (message) => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage("TODO");
        }
        return await signMessageAsync(message);
    };

    static mmx_signTransaction = async ({ tx }) => {
        if (vault.isLocked) {
            await notificationMessenger.sendMessage("TODO");
        }

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
        await notificationMessenger.sendMessage("TODO");
        return "Done!";
    };
}
