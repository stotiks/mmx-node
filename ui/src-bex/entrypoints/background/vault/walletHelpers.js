import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

import vault from "@bex/entrypoints/background/vault";
import { addr_t } from "@mmx/wallet/common/addr_t";
import { Wallet } from "@mmx/wallet/Wallet";
import { spend_options_t } from "@/mmx/wallet/common/spend_options_t";
import { Transaction } from "@/mmx/wallet/Transaction";

const getWalletByAddressAsync = async (address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const wallet = (await vault.getWalletsAsync()).find((w) => w.address === address);
    if (!wallet) {
        throw new Error(`Wallet not found for address: ${address}`);
    }
    return wallet;
};

export const getCurrentWalletAsync = async () => {
    const address = vault.getCurrentWalletAddress();
    return await getWalletByAddressAsync(address);
};

export const getPubKeyAsync = async (address = vault.getCurrentWalletAddress()) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        const { pubKey } = await ecdsaWallet.getKeysAsync(0);
        return bytesToHex(pubKey).toUpperCase();
    });
};

export const signMessageAsync = async (message, address = vault.getCurrentWalletAddress()) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        const msgWithPrefix = `MMX/sign_message/${message}`;
        const msgHash = sha256(utf8ToBytes(msgWithPrefix));
        return await ecdsaWallet.signMsgAsync(address, msgHash);
    });
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
const getValidatedSpendOptionsAsync = async (spendOptions) => {
    // validate network
    const network = await vault.getNetworkAsync();
    if (spendOptions.network !== network) {
        throw new Error("Invalid network");
    }

    // fill expire_at
    if (!spendOptions.expire_at && spendOptions.expire_delta) {
        const info = await getNodeInfoAsync();
        const height = info.height;

        spendOptions.expire_at = height + spendOptions.expire_delta;
        spendOptions.expire_delta = null;
    }

    return new spend_options_t(spendOptions);
};

export const getSendTxAsync = async (
    amount,
    dst_addr,
    currency,
    _options,
    address = vault.getCurrentWalletAddress()
) => {
    const options = await getValidatedSpendOptionsAsync(_options);

    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        if (!currency) {
            currency = new addr_t().toString();
        }
        // const mojoAmount = await getMojoAmountAsync(amount, currency, options);

        const tx = await Wallet.getSendTxAsync(ecdsaWallet, amount, dst_addr, currency, options);
        return tx;
    });
};

export const getOfferTradeTxAsync = async (
    address,
    amount,
    ask_currency,
    price,
    _options,
    wallet_address = vault.getCurrentWalletAddress()
) => {
    const options = new spend_options_t(_options);
    return vault.withECDSAWallet(wallet_address, async (ecdsaWallet) => {
        return await Wallet.getOfferTradeTxAsync(ecdsaWallet, address, amount, ask_currency, price, options);
    });
};

export const signTransactionAsync = async (_tx, _options, address = vault.getCurrentWalletAddress()) => {
    const tx = new Transaction(_tx);
    const options = new spend_options_t(_options);

    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        await ecdsaWallet.signOfAsync(tx, options);
        return tx;
    });
};
