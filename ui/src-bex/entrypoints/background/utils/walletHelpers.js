import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import vault from "../storage/vault";
import { sha256 } from "@noble/hashes/sha2";
// import { spend_options_t } from "@/mmx/wallet/common/spend_options_t";

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

    return await ecdsaWallet.signMsgAsync(address, msgHash);
};

export const signTransactionAsync = async (tx, address = vault.getCurrentWalletAddress()) => {
    const ecdsaWallet = await vault.getECDSAWalletAsync(address);
    //const options = new spend_options_t({ network1: "mainnet", expire_at1: -1 });
    await ecdsaWallet.signOfAsync(tx, { network: "mainnet" });
    return tx.toString();
};
