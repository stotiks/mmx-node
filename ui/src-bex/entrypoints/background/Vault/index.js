import { EncryptedStorageItem } from "./EncryptedStorageItem";

let instance = null;

class Vault {
    #password = null;
    #storageItem = new EncryptedStorageItem("local:vault");

    get isLocked() {
        return this.#password === null;
    }

    lock() {
        this.#password = null;
    }

    async unlock(password) {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked already");
        }

        await this.#storageItem.get(password); // check password

        this.#password = password;
    }

    async updatePassword(password) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        const data = await this.#storageItem.get(this.#password);
        await this.#storageItem.set(data, password);
        this.#password = password;
    }

    async #remove() {
        await this.#storageItem.remove();
    }

    async #getData() {
        return await this.#load();
    }

    async #setData(data) {
        return await this.#save(data);
    }

    async getWalletAddresses() {
        const data = await this.#getData();
        return data.wallets.map((wallet) => wallet.address);
    }

    async #load() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return await this.#storageItem.get(this.#password);
    }

    async #save(data) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        this.#storageItem.set(data, this.#password);
    }

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }
}

export default new Vault();
