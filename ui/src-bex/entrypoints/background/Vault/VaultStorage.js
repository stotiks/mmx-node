import { EncryptedStorageItem } from "./EncryptedStorageItem";

class VaultStorage {
    #password = null;
    #storageItem;
    #data;

    constructor() {
        this.#storageItem = new EncryptedStorageItem("local:vault");
    }

    get isLocked() {
        return this.#password === null;
    }

    async lock() {
        await this.save();
        this.#password = null;
        this.#data = null;
    }

    async unlock(password) {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked already");
        }

        if (await this.#storageItem.exists()) {
            this.#data = await this.#storageItem.get(password);
        } else {
            this.#data = {
                wallets: [],
            };
        }

        this.#password = password;
    }

    async updatePassword(password) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        this.#password = password;
        this.save();
    }

    async removeData() {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked, cannot remove data");
        }
        await this.#storageItem.remove();
    }

    async save() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        await this.#storageItem.set(this.#data, this.#password);
    }

    getWallets() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return this.#data.wallets;
    }
}

export default VaultStorage;
