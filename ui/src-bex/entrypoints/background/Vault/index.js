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

    async addWallet(seed) {
        const wallet = new ECDSA_Wallet(seed);
        const address = await wallet.getAddressAsync(0);

        const data = await this.#vaultStorage.getData();
        data.wallets ??= [];

        if (data.wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        data.wallets.push({
            address,
            seed,
            mnemonic: seedToWords(seed), //debug
        });

        await this.#vaultStorage.setData(data);
    }

    async getWalletsAddresses() {
        const data = await this.#vaultStorage.getData();
        return data.wallets.map((wallet) => wallet.address);
    }
}

export default new Vault();
