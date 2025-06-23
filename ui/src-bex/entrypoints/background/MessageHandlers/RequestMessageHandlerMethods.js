import { spend_options_t } from "@/mmx/wallet/common/spend_options_t";
import { Transaction } from "@/mmx/wallet/Transaction";
import { sha256 } from "@noble/hashes/sha2";
import { getNodeInfoAsync } from "../queries";

import {
    getCurrentWallet,
    getPubKeyAsync,
    getSendTxAsync,
    signMessageAsync,
    signTransactionAsync,
} from "../utils/walletHelpers";

import vault from "../stores/vault";
import { notificationMessenger } from "../utils/notificationMessenger";

const $method = (fn, metadata = {}) => {
    const method = fn;
    method.metadata = { isAcceptRequired: true, ...metadata };
    return method;
};

export class RequestMessageHandlerMethods {
    static mmx_blockNumber = $method(
        async () => {
            const info = await getNodeInfoAsync();
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

    static mmx_signMessage = $method(async ({ message }) => {
        const msgWithPrefix = `MMX/sign_message/${message}`;
        const msgHash = sha256(msgWithPrefix);
        return await signMessageAsync(msgHash);
    }, {});

    static mmx_send = $method(async ({ amount, dst_addr, currency, options: _options }) => {
        // Validate amount
        if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
            throw new Error("Invalid amount: must be a positive number");
        }
        // Validate dst_addr
        if (typeof dst_addr !== "string" || !dst_addr.trim()) {
            throw new Error("Invalid dst_addr: must be a non-empty string");
        }
        // Validate options
        if (typeof _options !== "object" || _options === null) {
            throw new Error("Invalid options format");
        }
        const options = new spend_options_t(_options);

        const tx = await getSendTxAsync(amount, dst_addr, currency, options);
        return tx;
    }, {});

    static mmx_signTransaction = $method(async ({ tx: _tx, options: _options }) => {
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
    }, {});

    // dummy method for testing
    static dummy = $method(
        async () => {
            await notificationMessenger.sendMessage({
                method: "dummy",
                params: {},
            });
            return "Done!";
        },
        {
            isAcceptRequired: false,
        }
    );
}
