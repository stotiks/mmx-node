import { bytesToHex } from "@noble/hashes/utils";
import vault from "../stores/vault";
import { addr_t } from "@/mmx/wallet/common/addr_t";
import { Wallet } from "@/mmx/wallet/Wallet";
import { getContractAsync } from "../queries";
import { getChainParamsAsync } from "@/mmx/wallet/utils/getChainParamsAsync";

const getWalletByAddress = async (address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    return vault.getWallets().find((wallet) => wallet.address === address);
};

export const getCurrentWallet = () => {
    const address = vault.getCurrentWalletAddress();
    return getWalletByAddress(address);
};

export const getPubKeyAsync = async (address) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    const { pubKey } = await ecdsaWallet.getKeysAsync(0);

    return bytesToHex(pubKey).toUpperCase();
};

export const signMessageAsync = async (msg, address) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    return await ecdsaWallet.signMsgAsync(address, msg);
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

export const getSendTxAsync = async (amount, dst_addr, currency, options, address) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    if (!currency) {
        currency = new addr_t().toString();
    }
    // const mojoAmount = await getMojoAmountAsync(amount, currency, options);
    const tx = await Wallet.getSendTxAsync(ecdsaWallet, amount, dst_addr, currency, options);
    return tx;
};

export const signTransactionAsync = async (tx, options, address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    await ecdsaWallet.signOfAsync(tx, options);
};
