import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex } from "@noble/hashes/utils";
import vault from "../storage/vault";

const getWalletByAddress = async (address) => {
    return vault.getWallets().find((wallet) => wallet.address === address);
};

export const getCurrentWallet = () => {
    const address = vault.getCurrentWalletAddress();
    return getWalletByAddress(address);
};

export const getPubKeyAsync = async (address = vault.getCurrentWalletAddress()) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    const { pubKey } = await ecdsaWallet.getKeysAsync(0);

    return bytesToHex(pubKey).toUpperCase();
};

export const signMessageAsync = async (msg, address = vault.getCurrentWalletAddress()) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    return await ecdsaWallet.signMsgAsync(address, msg);
};

export const signTransactionAsync = async (tx, address = vault.getCurrentWalletAddress()) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    await ecdsaWallet.signOfAsync(tx, { network: "mainnet" });
    return tx.toString();
};
