import { Transaction } from "@/mmx/wallet/Transaction";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import { getNodeInfo } from "../queries";
import vault from "../storage/vault";
import { notificationMessenger } from "../utils/notificationMessenger";
import { getCurrentWallet, getPubKeyAsync, signMessageAsync, signTransactionAsync } from "../utils/walletHelpers";
import { openNotification } from "../utils/openNotification";
import { sha256 } from "@noble/hashes/sha2";
import { spend_options_t } from "@/mmx/wallet/common/spend_options_t";

/* global browser */
const getTabUrl = async (tabId) => {
    const tab = await browser.tabs.get(tabId);
    const url = new URL(tab.url);
    return url;
};

class MessageHandlerWithAuth extends MessageHandlerBase {
    static checkPermissionsAsync = async (message) => {
        console.log("Checking permissions...");

        if (message.sender.frameId != null) {
            throw new Error("iFrame not supported");
        }

        const tabId = message.sender.tabId;
        const url = await getTabUrl(tabId);

        //console.log("Tab url:", url.toString());

        const checkVaultPermissionsAsync = async () => await vault.checkPermissionsAsync(url).catch(() => false);

        if (await checkVaultPermissionsAsync()) {
            return true;
        } else {
            console.log("Requesting permissions...");
            const requestPermissionsResponse = await notificationMessenger.sendMessage({
                method: "requestPermissions",
                params: { message, url },
            });
            console.log("requestPermissionsResponse:", requestPermissionsResponse);
        }

        return await checkVaultPermissionsAsync();
    };

    static async handleAsync(message) {
        const { handler, method } = this.getHandlerData(message);

        console.log("MessageHandlerBase.handleAsync", method, handler.metadata);

        const permitted = await this.checkPermissionsAsync(message);
        if (permitted) {
            return await super.handleAsync(message);
        } else {
            throw new Error("Permissions not granted");
        }
    }
}

const $method = (fn, metadata) => {
    const method = fn;
    method.metadata = metadata;
    return method;
};

export class RequestMessageHandler extends MessageHandlerWithAuth {
    static mmx_blockNumber = $method(
        async () => {
            const info = await getNodeInfo();
            return info.height;
        },
        {
            description: "Gets block height",
            version: "1.0.0",
        }
    );

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
        return network;
    };

    static mmx_signMessage = async ({ message }) => {
        const msgWithPrefix = `MMX/sign_message/${message}`;
        const msgHash = sha256(msgWithPrefix);
        return await signMessageAsync(msgHash);
    };

    static mmx_signTransaction = async ({ tx: _tx, options: _options }) => {
        if (typeof _tx !== "object") {
            throw new Error("Invalid tx format");
        }

        if (typeof _options !== "object") {
            throw new Error("Invalid options format");
        }

        const tx = new Transaction(_tx);
        const options = new spend_options_t(_options);

        await signTransactionAsync(tx, options);

        return tx;
    };

    static dev_test_openPopup = async () => {
        await openNotification();
        return "Done!";
    };
}
