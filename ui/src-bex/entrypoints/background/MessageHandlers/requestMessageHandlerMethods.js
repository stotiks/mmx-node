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
    fn.metadata = { isAcceptRequired: true, ...metadata };
    return fn;
};

export const requestMessageHandlerMethods = {
    mmx_blockNumber: $method(
        async () => {
            const info = await getNodeInfoAsync();
            return info.height;
        },
        {
            isAcceptRequired: false,
        }
    ),

    mmx_requestWallets: $method(
        async () => {
            return await vault.getWallets();
        },
        {
            isAcceptRequired: false,
        }
    ),

    mmx_getCurrentWallet: $method(
        async () => {
            return getCurrentWallet();
        },
        {
            isAcceptRequired: false,
        }
    ),

    mmx_getPubKey: $method(
        async (params) => {
            return await getPubKeyAsync(params?.address);
        },
        {
            isAcceptRequired: false,
        }
    ),

    mmx_getNetwork: $method(
        async () => {
            const network = await vault.getNetwork();
            return network;
        },
        {
            isAcceptRequired: false,
        }
    ),

    mmx_signMessage: $method(async ({ message }) => {
        const msgWithPrefix = `MMX/sign_message/${message}`;
        const msgHash = sha256(msgWithPrefix);
        return await signMessageAsync(msgHash);
    }, {}),

    mmx_send: $method(async ({ amount, dst_addr, currency, options: _options }) => {
        const options = new spend_options_t(_options);
        const tx = await getSendTxAsync(amount, dst_addr, currency, options);
        //TODO send tx
        return {
            id: tx.id,
            dev: {
                tx,
            },
        };
    }, {}),

    mmx_signTransaction: $method(async ({ tx: _tx, options: _options }) => {
        const tx = new Transaction(_tx);
        const options = new spend_options_t(_options);
        await signTransactionAsync(tx, options);
        return tx;
    }, {}),

    // dummy method for testing
    dummy: $method(
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
    ),
};
