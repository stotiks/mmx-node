import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { EncryptedStorageItem } from "./StorageItem";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

class Vault {
    #password;

    #walletStorage = new EncryptedStorageItem("local:wallets");
    #wallets$$sensitive;

    #currentWalletAddress;
    getCurrentWalletAddress() {
        return this.#currentWalletAddress;
    }

    getNetwork() {
        return "MMX/mainnet";
    }

    get isLocked() {
        return this.#password == null;
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
            this.#wallets$$sensitive = await this.#walletStorage.get(password);
        } else {
            this.#wallets$$sensitive = [];
        }
    }

    async #unloadAsync() {
        this.#wallets$$sensitive = null;
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
        await this.#walletStorage.set(this.#wallets$$sensitive, this.#password);
    }

    #walletCleanup = (wallet) => ({ ...wallet, seed: "######", password: "******" });
    getWallets() {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        return this.#wallets$$sensitive.map((wallet) => this.#walletCleanup(wallet));
    }

    async addWalletAsync(mnemonic, password = "") {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        const ecdsaWallet = new ECDSA_Wallet(mnemonic, password);
        const address = await ecdsaWallet.getAddressAsync(0);
        const seed = bytesToHex(mnemonicToSeed(mnemonic)).toUpperCase();

        const newWallet$$sensitive = { address, seed, password };

        const wallets = this.getWallets();
        if (wallets.some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        this.#wallets$$sensitive.push(newWallet$$sensitive);
        await this.saveAsync();

        this.emit("wallet-added");
        return this.#walletCleanup(newWallet$$sensitive);
    }

    async removeWalletAsync(address) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }

        const index = this.getWallets().findIndex((wallet) => wallet.address === address);
        if (index === -1) {
            throw new Error("Wallet not found");
        }

        this.#wallets$$sensitive.splice(index, 1);
        await this.saveAsync();

        this.emit("wallet-removed");
    }

    setCurrentWallet(address) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        this.#currentWalletAddress = address;
        this.emit("current-wallet-updated");
    }

    async getECDSAWalletAsync(address) {
        if (this.isLocked) {
            throw new Error("Vault is locked");
        }
        const wallet = this.#wallets$$sensitive.find((wallet) => wallet.address === address);
        const seed = hexToBytes(wallet.seed);
        const ecdsaWallet = new ECDSA_Wallet(seed, wallet.password);
        return ecdsaWallet;
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
