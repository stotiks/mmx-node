import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
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

    async lockAsync() {
        if (this.isLocked) {
            throw new Error("Vault is locked already");
        }
        await this.saveAsync();
        await this.#unloadAsync();
        this.emit("vault-lock");
    }

    async unlockAsync(password) {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked already");
        }

        await this.#loadAsync(password);
        this.#password = password;
        this.emit("vault-unlock");
    }

    async #loadAsync(password) {
        if (await this.#walletStorage.exists()) {
            this.#wallets = await this.#walletStorage.get(password);
            this.emit("wallets-loaded");
        } else {
            this.#wallets = [];
        }
    }

    async #unloadAsync() {
        this.#wallets = null;
        this.#password = null;
    }

    async updatePasswordAsync(password) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        this.#password = password;
        await this.saveAsync();
    }

    async removeDataAsync() {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked, cannot remove data");
        }
        await this.#walletStorage.remove();
    }

    async saveAsync() {
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

    async addWalletAsync(seed, password = "") {
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

        await this.saveAsync();
    }

    getWalletsAddresses() {
        const wallets = this.#getWallets();
        return wallets.map((wallet) => wallet.address);
    }

    // events
    _events = new Map();

    on = (eventName, callback) => {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, []);
        }
        this._events.get(eventName).push(callback);
        return this;
    };

    removeListener(eventName, callback) {
        if (this._events.has(eventName)) {
            const callbacks = this._events.get(eventName);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    emit(eventName, ...args) {
        if (this._events.has(eventName)) {
            this._events.get(eventName).forEach((callback) => {
                try {
                    callback(...args);
                } catch (err) {
                    console.error(`Error in ${eventName} handler:`, err);
                }
            });
        }

        if (this._events.has("<any>")) {
            this._events.get("<any>").forEach((callback) => {
                try {
                    callback(eventName, ...args);
                } catch (err) {
                    console.error(`Error in ${eventName} handler:`, err);
                }
            });
        }
    }
}

export default new Vault();
