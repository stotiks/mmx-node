import { EncryptedStorageItem } from "./EncryptedStorageItem";

class VaultStorage {
    #password = null;
    #storageItem;

    constructor(storageKey) {
        this.#storageItem = new EncryptedStorageItem(storageKey);
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
        await this.#storageItem.get(password); // check password for validity
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
        this.#storageItem.set(data, this.#password);
    }
}

export default VaultStorage;
