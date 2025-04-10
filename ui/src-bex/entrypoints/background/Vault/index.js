import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import VaultStorage from "./VaultStorage";
import { seedToWords } from "@/mmx/wallet/mnemonic";

let instance = null;

class Vault {
    #vaultStorage = new VaultStorage();

    unlock = async (password) => await this.#vaultStorage.unlock(password);
    removeData = async () => await this.#vaultStorage.removeData();

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    async addWallet(seed, password) {
        const wallet = new ECDSA_Wallet(seed, password);
        const address = await wallet.getAddressAsync(0);

        const wallets = this.#vaultStorage.getWallets();

        if (wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        wallets.push({
            address,
            seed,
            password,
            mnemonic: seedToWords(seed), //debug
        });

        await this.#vaultStorage.save();
    }

    async getWalletsAddresses() {
        const wallets = this.#vaultStorage.getWallets();
        return wallets.map((wallet) => wallet.address);
    }
}

export default new Vault();
