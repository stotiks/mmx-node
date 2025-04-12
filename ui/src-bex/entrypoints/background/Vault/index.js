import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import VaultStorage from "./VaultStorage";
import { seedToWords } from "@/mmx/wallet/mnemonic";

let instance = null;

import { EncryptedStorageItem } from "./StorageItem";

class Vault {
    #password = null;
    #walletStorage;
    #wallets;

    constructor() {
        if (!instance) {
            this.#walletStorage = new EncryptedStorageItem("local:wallets");
            instance = this;
        }
        return instance;
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

    #getWallets() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return this.#wallets;
    }

    async addWallet(seed, password = "") {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        const wallet = new ECDSA_Wallet(seed, password);
        const address = await wallet.getAddressAsync(0);

        const wallets = this.#getWallets();

        if (wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        wallets.push({
            address,
            seed,
            password,
            mnemonic: seedToWords(seed), //debug
        });

        await this.save();
    }

    async getWalletsAddresses() {
        const wallets = this.#getWallets();
        return wallets.map((wallet) => wallet.address);
    }
}

export default new Vault();
