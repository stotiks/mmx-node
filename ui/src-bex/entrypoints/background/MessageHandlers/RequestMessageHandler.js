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
    static async handleAsync(message) {
        // ---- start of requestPermissionsAndAcceptAsync
        const requestPermissionsAndAcceptAsync = async (message) => {
            console.log("Checking permissions...");

            if (message.sender.frameId != null) {
                throw new Error("iFrame not supported");
            }

            const tabId = message.sender.tabId;
            const url = await getTabUrl(tabId);

            const isAcceptRequired = this.getHandlerData(message).handler.metadata?.isAcceptRequired ?? true;

            const checkVaultPermissionsAsync = async () => await vault.checkPermissionsAsync(url).catch(() => false);
            const _hasPermissions = (await checkVaultPermissionsAsync()) === true;

            let accepted = false;
            if (isAcceptRequired === true || _hasPermissions === false) {
                const requestPermissionsResponse = await notificationMessenger.sendMessage({
                    method: "requestPermissions",
                    params: { message, url },
                });
                console.log("requestPermissionsResponse:", requestPermissionsResponse);
                accepted = requestPermissionsResponse.data.accepted === true;
            }

            const hasPermissions = await checkVaultPermissionsAsync();
            const hasAccept = accepted === true || isAcceptRequired === false;

            console.log("requestPermissionsAndAcceptAsync:", { hasPermissions, hasAccept });

            if (!hasPermissions) {
                throw new Error("Permissions not granted");
            }

            if (!hasAccept) {
                throw new Error("Request not accepted");
            }

            return { hasPermissions, hasAccept };
        };
        // ---- end of requestPermissionsAndAcceptAsync

        const { hasPermissions, hasAccept } = await requestPermissionsAndAcceptAsync(message);

        if (hasPermissions === true && hasAccept === true) {
            return await super.handleAsync(message);
        } else {
            throw new Error("Request not allowed");
        }
    }
}

const $method = (fn, metadata = {}) => {
    const method = fn;
    method.metadata = { isAcceptRequired: true, ...metadata };
    return method;
};

export class RequestMessageHandler extends MessageHandlerWithAuth {
    static mmx_blockNumber = $method(
        async () => {
            const info = await getNodeInfo();
            return info.height;
        },
        {
            isAcceptRequired: false,
        }
    );

    static mmx_requestWallets = $method(
        async () => {
            return await vault.getWallets();
        },
        {
            isAcceptRequired: false,
        }
    );

    static mmx_getCurrentWallet = $method(
        async () => {
            return getCurrentWallet();
        },
        {
            isAcceptRequired: false,
        }
    );

    static mmx_getPubKey = $method(
        async (params) => {
            return await getPubKeyAsync(params?.address);
        },
        {
            isAcceptRequired: false,
        }
    );

    static mmx_getNetwork = $method(
        async () => {
            const network = await vault.getNetwork();
            return network;
        },
        {
            isAcceptRequired: false,
        }
    );

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

    static dev_test_openPopup = $method(
        async () => {
            await openNotification();
            return "Done!";
        },
        {
            isAcceptRequired: false,
        }
    );
}
