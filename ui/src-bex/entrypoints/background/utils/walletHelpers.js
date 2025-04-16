import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import vault from "../storage/vault";
import { sha256 } from "@noble/hashes/sha256";

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
    const msgWithPrefix = `MMX/sign_message/${msg}`;
    const msgHash = sha256(msgWithPrefix);

    const ecdsaWallet = await vault.getECDSAWalletAsync(address);

    const signature = await ecdsaWallet.signMsgAsync(address, msgHash);
    return signature;
};
