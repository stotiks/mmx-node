import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";

import { EncryptedStorageItem } from "./StorageItem";

class Vault {
    #password = null;
    #walletStorage = new EncryptedStorageItem("local:wallets");
    #wallets;

    get isLocked() {
        return this.#password === null;
    }

    async lockAsync() {
        if (this.isLocked) {
            throw new Error("Vault is locked already");
        }
        await this.saveAsync();
        await this.#unloadAsync();
        this.emit("locked");
        return this.isLocked;
    }

    async unlockAsync(password) {
        if (!this.isLocked) {
            throw new Error("Vault is unlocked already");
        }

        await this.#loadAsync(password);
        this.#password = password;
        this.emit("unlocked");
        return this.isLocked;
    }

    async #loadAsync(password) {
        if (await this.#walletStorage.exists()) {
            this.#wallets = await this.#walletStorage.get(password);
            //this.emit("wallets-loaded");
        } else {
            this.#wallets = [];
        }
    }

    async #unloadAsync() {
        this.#wallets = null;
        this.#password = null;
    }

    async updatePasswordAsync(password, newPassword) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        if (password !== this.#password) {
            throw new Error("Wrong password");
        }

        this.#password = newPassword;
        await this.saveAsync();
        this.emit("password-updated");
        return true;
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

    async addWalletAsync(mnemonic, password = "") {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        const wallet = new ECDSA_Wallet(mnemonic, password);
        const address = await wallet.getAddressAsync(0);

        const wallets = this.#getWallets();

        if (wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        const seed = mnemonicToSeed(mnemonic);

        wallets.push({
            address,
            seed,
            password,
        });

        await this.saveAsync();
        this.emit("wallet-added");
    }

    async removeWalletAsync(address) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        const wallets = this.#getWallets();
        const index = wallets.findIndex((wallet) => wallet.address === address);
        if (index === -1) {
            throw new Error("Wallet not found");
        }
        wallets.splice(index, 1);
        await this.saveAsync();
        this.emit("wallet-removed");
    }

    getWallets() {
        const wallets = this.#getWallets();
        return wallets.map(({ address }) => ({ address, seed: "######", password: "******" }));
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

let vault;
if (!vault) {
    vault = new Vault();
}

export default vault;
