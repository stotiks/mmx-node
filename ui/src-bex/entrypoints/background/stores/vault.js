import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { EncryptedStorageItem } from "../utils/StorageItem";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

/**
 * Constant-time string comparison to prevent timing attacks.
 * Returns true if a and b are equal, false otherwise.
 */
function timingSafeEqual(a, b) {
    if (typeof a !== "string" || typeof b !== "string") return false;
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

class Vault {
    #password;

    #walletStorage = new EncryptedStorageItem("local:wallets");
    #wallets$$sensitive;

    #currentWalletAddress;
    getCurrentWalletAddress() {
        return this.#currentWalletAddress;
    }

    getNetwork() {
        return "mainnet";
    }

    get isUnlocked() {
        return this.#password != null;
    }

    getIsUnlocked() {
        return this.isUnlocked;
    }

    async lockAsync() {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked already");
        }
        await this.saveAsync();
        await this.#unloadAsync();
        this.emit("locked");
        return this.isUnlocked;
    }

    async unlockAsync({ password }) {
        if (this.isUnlocked === true) {
            //throw new Error("Vault is unlocked already");
            return this.isUnlocked;
        }

        await this.#loadAsync(password);
        this.#password = password;
        this.emit("unlocked");
        return this.isUnlocked;
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

    async updatePasswordAsync({ password, newPassword }) {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }

        // Validate inputs
        if (typeof password !== "string" || typeof newPassword !== "string") {
            throw new Error("Passwords must be strings");
        }

        if (!timingSafeEqual(password, this.#password)) {
            throw new Error("Wrong password");
        }

        this.#password = newPassword;
        await this.saveAsync();
        this.emit("password-updated");
        return true;
    }

    async removeDataAsync() {
        if (this.isUnlocked === true) {
            throw new Error("Vault is unlocked, cannot remove data");
        }
        await this.#walletStorage.remove();
    }

    async saveAsync() {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }
        await this.#walletStorage.set(this.#wallets$$sensitive, this.#password);
    }

    #walletCleanup = ({ seed, password, ...wallet }) => wallet;
    getWallets() {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }
        return this.#wallets$$sensitive.map((wallet) => this.#walletCleanup(wallet));
    }

    async addWalletAsync({ mnemonic, password = "" }) {
        if (this.isUnlocked !== true) {
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

        this.emit("wallet-added", { address });
        return this.#walletCleanup(newWallet$$sensitive);
    }

    async removeWalletAsync({ address }) {
        if (this.isUnlocked !== true) {
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

    setCurrentWallet({ address }) {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }

        // Validate that the wallet exists
        const wallets = this.getWallets();
        const walletExists = wallets.some((wallet) => wallet.address === address);

        if (!walletExists) {
            throw new Error(`Wallet with address ${address} not found`);
        }

        this.#currentWalletAddress = address;
        this.emit("current-wallet-changed", { address });
    }

    async getECDSAWalletAsync(address = this.getCurrentWalletAddress()) {
        if (!address) {
            throw new Error("No wallet selected");
        }

        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }

        const wallet = this.#wallets$$sensitive.find((wallet) => wallet.address === address);
        if (!wallet) {
            throw new Error(`Wallet not found for address: ${address}`);
        }

        const seed = hexToBytes(wallet.seed);
        const ecdsaWallet = new ECDSA_Wallet(seed, wallet.password);
        return ecdsaWallet;
    }

    // permissions
    #allowedOriginsSet = new Set();
    async checkPermissionsAsync(url) {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }
        const origin = new URL(url).origin;
        if (this.#allowedOriginsSet.has(origin)) {
            return true;
        }
        return false;
    }

    async allowUrlAsync(url) {
        if (this.isUnlocked !== true) {
            throw new Error("Vault is locked");
        }
        const origin = new URL(url).origin;
        this.#allowedOriginsSet.add(origin);
    }

    // events
    _events = new Map();

    on(eventName, callback) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, []);
        }
        this._events.get(eventName).push(callback);
        return this;
    }

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
