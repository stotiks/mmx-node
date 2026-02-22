import { addr_t } from "@/mmx/wallet/common/addr_t";
import { Wallet } from "@/mmx/wallet/Wallet";
import vault from "@bex/entrypoints/background/vault";
import { bytesToHex } from "@noble/hashes/utils.js";

/**
 * Execute a callback function with an ECDSA wallet instance and ensure cleanup.
 * This function gets the ECDSA wallet, calls the callback, and destroys the wallet
 * to securely clean up sensitive cryptographic data from memory.
 *
 * @param {string} address - The wallet address
 * @param {Function} callback - Async function that receives the ecdsaWallet instance
 * @returns {Promise<*>} The result of the callback function
 */
const withECDSAWallet = async (address, callback) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync({ address });
    try {
        return await callback(ecdsaWallet);
    } finally {
        ecdsaWallet.destroy();
    }
};

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
    return withECDSAWallet(address, async (ecdsaWallet) => {
        const { pubKey } = await ecdsaWallet.getKeysAsync(0);
        return bytesToHex(pubKey).toUpperCase();
    });
};

export const signMessageAsync = async (msg, address = vault.getCurrentWalletAddress()) => {
    return withECDSAWallet(address, async (ecdsaWallet) => {
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
    return withECDSAWallet(address, async (ecdsaWallet) => {
        if (!currency) {
            currency = new addr_t().toString();
        }
        // const mojoAmount = await getMojoAmountAsync(amount, currency, options);
        const tx = await Wallet.getSendTxAsync(ecdsaWallet, amount, dst_addr, currency, options);
        return tx;
    });
};

export const signTransactionAsync = async (tx, options, address = vault.getCurrentWalletAddress()) => {
    return withECDSAWallet(address, async (ecdsaWallet) => {
        await ecdsaWallet.signOfAsync(tx, options);
    });
};
