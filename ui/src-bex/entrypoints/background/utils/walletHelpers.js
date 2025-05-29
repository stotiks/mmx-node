import { bytesToHex } from "@noble/hashes/utils";
import vault from "../stores/vault";

const getWalletByAddress = async (address) => {
    return vault.getWallets().find((wallet) => wallet.address === address);
};

export const getCurrentWallet = () => {
    const address = vault.getCurrentWalletAddress();
    if (!address) {
        throw new Error("No wallet selected");
    }
    return getWalletByAddress(address);
};

export const getPubKeyAsync = async (address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    const { pubKey } = await ecdsaWallet.getKeysAsync(0);

    return bytesToHex(pubKey).toUpperCase();
};

export const signMessageAsync = async (msg, address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    return await ecdsaWallet.signMsgAsync(address, msg);
};

export const signTransactionAsync = async (tx, options, address) => {
    if (!address) {
        throw new Error("No wallet selected");
    }
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    await ecdsaWallet.signOfAsync(tx, options);
};
