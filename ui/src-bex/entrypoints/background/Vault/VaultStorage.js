import { EncryptedStorageItem } from "./StorageItem";

class VaultStorage {
    #password = null;
    #walletStorage;
    #wallets;

    constructor() {
        this.#walletStorage = new EncryptedStorageItem("local:vault");
    }

    get isLocked() {
        return this.#password === null;
    }

    async lock() {
        await this.save();
        await this.#unload();
    }

    async unlock(password) {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked already");
        }

        await this.#load(password);
        this.#password = password;
    }

    async #load(password) {
        if (await this.#walletStorage.exists()) {
            this.#wallets = await this.#walletStorage.get(password);
        } else {
            this.#wallets = [];
        }
    }

    async #unload() {
        this.#wallets = null;
        this.#password = null;
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
        await this.#walletStorage.remove();
    }

    async save() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        await this.#walletStorage.set(this.#wallets, this.#password);
    }

    getWallets() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return this.#wallets;
    }
}

export default VaultStorage;
