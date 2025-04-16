import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import vault from "../storage/vault";

export const getPubKeyAsync = async (address) => {
    if (address == null) {
        address = vault.getCurrentWalletAddress();
    }

    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    const { pubKey } = await ecdsaWallet.getKeysAsync(0);

    return bytesToHex(pubKey).toUpperCase();
};

export const getWalletByAddress = async (address) => {
    return vault.getWallets().find((wallet) => wallet.address === address);
};

export const getCurrentWalletAsync = async () => {
    return getWalletByAddress(vault.getCurrentWalletAddress());
};
