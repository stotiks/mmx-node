import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

import vault from "@bex/entrypoints/background/vault";
import { addr_t } from "@mmx/wallet/common/addr_t";
import { Wallet } from "@mmx/wallet/Wallet";
import { spend_options_t } from "@/mmx/wallet/common/spend_options_t";
import { Transaction } from "@/mmx/wallet/Transaction";

const withECDSAWalletAsync = async (address, callback) =>
    await vault.withECDSAWalletAsync(address, async (ecdsaWallet) => {
        const height = await getCurrentHeightAsync();
        ecdsaWallet.updateHeight(height);
        return await callback(ecdsaWallet);
    });

const getWalletByAddressAsync = async (address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const wallets = await vault.getWalletsAsync();
    const wallet = wallets.find((wallet) => wallet.address === address);
    if (!wallet) {
        throw new Error(`Wallet not found for address: ${address}`);
    }
    return wallet;
};

export const getCurrentWalletAsync = async () => {
    const address = await vault.getCurrentWalletAddressAsync();
    return await getWalletByAddressAsync(address);
};

export const getPubKeyAsync = async (address) => {
    address ??= await vault.getCurrentWalletAddressAsync();
    return await withECDSAWalletAsync(address, async (ecdsaWallet) => {
        const { pubKey } = await ecdsaWallet.getKeysAsync(0);
        return bytesToHex(pubKey).toUpperCase();
    });
};

export const signMessageAsync = async (message, address) => {
    address ??= await vault.getCurrentWalletAddressAsync();
    if (typeof message !== "string" || message.length > 10000) {
        throw new Error("Invalid message");
    }
    const msgWithPrefix = `MMX/sign_message/${message}`;
    const msgHash = sha256(utf8ToBytes(msgWithPrefix));
    return await withECDSAWalletAsync(address, async (ecdsaWallet) => await ecdsaWallet.signMsgAsync(address, msgHash));
};

// const getMojoAmountAsync = async (amount, currency, options) => {
//     let decimals = 0;

//     if (currency == new addr_t().toString()) {
//         const chainParams = await getChainParamsAsync(options.network);
//         decimals = chainParams.decimals;
//     } else {
//         const contract = await getContractAsync(currency);
//         decimals = contract.decimals;
//     }

//     const mojoAmount = Number(amount) * 10 ** decimals;
//     console.log("getMojoAmountAsync:", currency, amount, decimals, mojoAmount);
//     return mojoAmount;
// };

import { getNodeInfoAsync } from "@bex/entrypoints/background/queries";
export const getCurrentHeightAsync = async () => {
    const info = await getNodeInfoAsync();
    return info.height;
};

const getValidatedSpendOptionsAsync = async (spendOptions) => {
    const options = { ...spendOptions };
    // validate network
    const network = await vault.getNetworkAsync();
    if (options.network !== network) {
        throw new Error("Invalid network");
    }

    // // fill expire_at
    // if (!options.expire_at && options.expire_delta) {
    //     const height = await getCurrentHeightAsync();

    //     options.expire_at = height + options.expire_delta;
    //     options.expire_delta = null;
    // }

    return new spend_options_t(options);
};

export const getSendTxAsync = async (amount, dst_addr, currency, _options, address) => {
    address ??= await vault.getCurrentWalletAddressAsync();
    const options = await getValidatedSpendOptionsAsync(_options);
    if (!currency) {
        currency = new addr_t().toString();
    }
    return await withECDSAWalletAsync(
        address,
        async (ecdsaWallet) => await Wallet.getSendTxAsync(ecdsaWallet, amount, dst_addr, currency, options)
    );
};

export const getOfferTradeTxAsync = async (address, amount, ask_currency, price, _options, wallet_address) => {
    wallet_address ??= await vault.getCurrentWalletAddressAsync();
    const options = await getValidatedSpendOptionsAsync(_options);
    return await withECDSAWalletAsync(
        wallet_address,
        async (ecdsaWallet) =>
            await Wallet.getOfferTradeTxAsync(ecdsaWallet, address, amount, ask_currency, price, options)
    );
};

export const signTransactionAsync = async (_tx, _options, address) => {
    address ??= await vault.getCurrentWalletAddressAsync();
    const options = await getValidatedSpendOptionsAsync(_options);
    const tx = new Transaction(_tx);

    return await withECDSAWalletAsync(address, async (ecdsaWallet) => {
        await ecdsaWallet.signOfAsync(tx, options);
        return tx;
    });
};
