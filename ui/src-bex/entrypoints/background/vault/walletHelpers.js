import { addr_t } from "@/mmx/wallet/common/addr_t";
import { Wallet } from "@/mmx/wallet/Wallet";
import vault from "@bex/entrypoints/background/vault";
import { bytesToHex } from "@noble/hashes/utils.js";

const getWalletByAddress = async (address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const wallet = (await vault.getWalletsAsync()).find((w) => w.address === address);
    if (!wallet) {
        throw new Error(`Wallet not found for address: ${address}`);
    }
    return wallet;
};

export const getCurrentWallet = () => {
    const address = vault.getCurrentWalletAddress();
    return getWalletByAddress(address);
};

export const getPubKeyAsync = async (address = vault.getCurrentWalletAddress()) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        const { pubKey } = await ecdsaWallet.getKeysAsync(0);
        return bytesToHex(pubKey).toUpperCase();
    });
};

export const signMessageAsync = async (msg, address = vault.getCurrentWalletAddress()) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        return await ecdsaWallet.signMsgAsync(address, msg);
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

export const getSendTxAsync = async (
    amount,
    dst_addr,
    currency,
    options,
    address = vault.getCurrentWalletAddress()
) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        if (!currency) {
            currency = new addr_t().toString();
        }
        // const mojoAmount = await getMojoAmountAsync(amount, currency, options);
        const tx = await Wallet.getSendTxAsync(ecdsaWallet, amount, dst_addr, currency, options);
        return tx;
    });
};

export const signTransactionAsync = async (tx, options, address = vault.getCurrentWalletAddress()) => {
    return vault.withECDSAWallet(address, async (ecdsaWallet) => {
        await ecdsaWallet.signOfAsync(tx, options);
    });
};
