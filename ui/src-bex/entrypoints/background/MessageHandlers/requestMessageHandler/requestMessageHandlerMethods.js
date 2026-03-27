import { broadcastTransactionAsync, validateTransactionAsync } from "@bex/entrypoints/background/queries";

import {
    getCurrentWalletAsync,
    getCurrentHeightAsync,
    getOfferTradeTxAsync,
    getPubKeyAsync,
    getSendTxAsync,
    signMessageAsync,
    signTransactionAsync,
} from "@bex/entrypoints/background/vault/walletHelpers";

import notificationMessenger from "@bex/entrypoints/background/notificationMessenger";
import vault from "@bex/entrypoints/background/vault";

const broadcastTransactionAsync2 = async (tx) => {
    if (import.meta.env.DEV) {
        const result = await validateTransactionAsync(tx);

        if (result.error) {
            const message = result.error?.message || result.error;
            throw new Error(message);
        }
    } else {
        await broadcastTransactionAsync(tx);
    }

    const result = {
        id: tx.id,

        ...(import.meta.env.DEV && {
            dev: {
                tx,
            },
        }),
    };
    return result;
};

const $method = (fn, metadata = {}) => {
    fn.metadata = { isAcceptRequired: true, ...metadata };
    return fn;
};

export const requestMessageHandlerMethods = {
    mmx_blockNumber: $method(async () => getCurrentHeightAsync(), {
        isAcceptRequired: false,
    }),

    mmx_requestWallets: $method(async () => await vault.getWalletsAsync(), {
        isAcceptRequired: false,
    }),

    mmx_getCurrentWallet: $method(async () => getCurrentWalletAsync(), {
        isAcceptRequired: false,
    }),

    mmx_getPubKey: $method(async (params) => await getPubKeyAsync(params?.address), {
        isAcceptRequired: false,
    }),

    mmx_getNetwork: $method(async () => await vault.getNetworkAsync(), {
        isAcceptRequired: false,
    }),

    mmx_signMessage: $method(async ({ message }) => await signMessageAsync(message), {}),

    mmx_send: $method(async ({ amount, dst_addr, currency, options: options }) => {
        const tx = await getSendTxAsync(amount, dst_addr, currency, options);
        return broadcastTransactionAsync2(tx);
    }, {}),

    mmx_signTransaction: $method(async ({ tx, options }) => await signTransactionAsync(tx, options), {}),

    mmx_offerTrade: $method(async ({ address, amount, ask_currency, price, options }) => {
        const tx = await getOfferTradeTxAsync(address, amount, ask_currency, price, options);
        return broadcastTransactionAsync2(tx);
    }, {}),

    // dummy method for testing
    dummy: $method(
        async () => {
            await notificationMessenger.openNotificationAsync();
            return "Done!";
        },
        {
            isAcceptRequired: false,
        }
    ),
};
