import { EncryptedStorageItem } from "./EncryptedStorageItem";

class VaultStorage {
    #password = null;
    #storageItem;

    constructor() {
        this.#storageItem = new EncryptedStorageItem("local:vault");
    }

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

        if (await this.#storageItem.exists()) {
            // check password for validity
            await this.#storageItem.get(password);
        } else {
            await this.#storageItem.set({}, password);
        }

        this.#password = password;
    }

    async updatePassword(password) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        await this.#storageItem.updatePassword(this.#password, password);
        this.#password = password;
    }

    async removeData() {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked, cannot remove data");
        }
        await this.#storageItem.remove();
    }

    async getData() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return await this.#storageItem.get(this.#password);
    }

    async setData(data) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        await this.#storageItem.set(data, this.#password);
    }
}

export default VaultStorage;
