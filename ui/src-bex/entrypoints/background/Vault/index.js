import VaultStorage from "./VaultStorage";

let instance = null;

class Vault {
    #vaultStorage = new VaultStorage("local:vault");

    unlock = async (password) => await this.#vaultStorage.unlock(password);

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    async getWalletAddresses() {
        const data = await this.#vaultStorage.getData();
        return data.wallets.map((wallet) => wallet.address);
    }
}

export default new Vault();
