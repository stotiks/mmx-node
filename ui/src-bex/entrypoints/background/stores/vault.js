import { ECDSA_Wallet } from "@/mmx/wallet/ECDSA_Wallet";
import { mnemonicToSeed } from "@/mmx/wallet/mnemonic";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

import { EncryptedStorageItem } from "../utils/StorageItem";

class Vault {
    #MAX_HISTORY_ENTRIES = 10;

    #walletStorage = new EncryptedStorageItem("local:wallets");
    #historyStorage = new EncryptedStorageItem("local:history");

    #wallets$$sensitive = [];
    #isUnlocked = false;
    #encryptionKey = null;
    #currentWalletAddress = null;

    get isUnlocked() {
        return this.#isUnlocked;
    }

    // method for message handler
    getIsUnlocked() {
        return this.isUnlocked;
    }

    #generateEncryptionKey(password) {
        const salt = "7YvAn2bkuXwWoF";
        return bytesToHex(sha256(`${salt}${password}${salt}`)).toUpperCase();
    }

    async unlockAsync({ password }) {
        if (this.isUnlocked) {
            return true;
        }

        const encryptionKey = this.#generateEncryptionKey(password);
        await this.#loadAsync(encryptionKey);
        this.#encryptionKey = encryptionKey;
        this.#isUnlocked = true;
        this.emit("unlocked");

        return true;
    }

    async lockAsync() {
        if (!this.isUnlocked) {
            //throw new Error("Vault is locked already");
            await this.#unloadAsync();
            return false;
        }
        await this.saveAsync();
        await this.#unloadAsync();
        this.emit("locked");
        return false;
    }

    async getIsInitializedAsync() {
        return await this.#walletStorage.exists();
    }

    async #loadAsync(encryptionKey) {
        if (!(await this.getIsInitializedAsync())) {
            throw new Error("Vault is not initialized");
        }

        if (await this.#walletStorage.exists()) {
            this.#wallets$$sensitive = await this.#walletStorage.get(encryptionKey);
        }
    }

    async #unloadAsync() {
        this.#wallets$$sensitive = [];
        this.#history = [];
        this.#encryptionKey = null;

        this.#isUnlocked = false;
    }

    async #saveAsync(encryptionKey) {
        await this.#walletStorage.set(this.#wallets$$sensitive, encryptionKey);
    }

    async saveAsync() {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }
        await this.#saveAsync(this.#encryptionKey);
    }

    async initVaultAsync({ password }) {
        if (await this.getIsInitializedAsync()) {
            throw new Error("Vault is already initialized.");
        }

        this.#wallets$$sensitive = [];
        this.#isUnlocked = false;

        const encryptionKey = this.#generateEncryptionKey(password);

        await this.#saveAsync(encryptionKey);

        this.emit("initialized");
        return true;
    }

    async updatePasswordAsync({ password, newPassword }) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        if (typeof password !== "string" || !password || typeof newPassword !== "string" || !newPassword) {
            throw new Error("Passwords must be non-empty strings");
        }

        // This comparison is not a security risk because it does not involve a secret value.
        // It's a simple validation check to ensure the new password is not the same as the old one.
        // The actual credential check is performed later by comparing derived encryption keys, which is safe.
        // eslint-disable-next-line security/detect-possible-timing-attacks
        if (password === newPassword) {
            throw new Error("New password must be different from the old password.");
        }

        const currentEncryptionKey = this.#generateEncryptionKey(password);
        if (currentEncryptionKey !== this.#encryptionKey) {
            throw new Error("Wrong password");
        }

        this.#encryptionKey = this.#generateEncryptionKey(newPassword);
        await this.saveAsync();
        this.emit("password-updated");
        return true;
    }

    async removeVaultDataAsync() {
        if (this.isUnlocked) {
            throw new Error("Cannot remove vault while it is unlocked.");
        }
        await this.#historyStorage.remove();
        await this.#walletStorage.remove();
        this.emit("vault-removed");
    }

    // Wallet
    getNetwork() {
        return "mainnet";
    }

    getCurrentWalletAddress() {
        return this.#currentWalletAddress;
    }

    #walletCleanup = ({ seed, password, ...wallet }) => wallet;

    getWallets() {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }
        return this.#wallets$$sensitive.map((wallet) => this.#walletCleanup(wallet));
    }

    async addWalletAsync({ mnemonic, password = "" }) {
        if (!this.isUnlocked) throw new Error("Vault is locked");

        const ecdsaWallet = new ECDSA_Wallet(mnemonic, password);
        const address = await ecdsaWallet.getAddressAsync(0);
        const seed = bytesToHex(mnemonicToSeed(mnemonic)).toUpperCase();
        const newWallet$$sensitive = { address, seed, password };

        if (this.getWallets().some((wallet) => wallet.address === address)) {
            throw new Error("Wallet already exists");
        }

        this.#wallets$$sensitive.push(newWallet$$sensitive);
        await this.saveAsync();
        this.emit("wallet-added", { address });
        return this.#walletCleanup(newWallet$$sensitive);
    }

    async removeWalletAsync({ address }) {
        if (!this.isUnlocked) {
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
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        if (address && !this.getWallets().some((wallet) => wallet.address === address)) {
            throw new Error(`Wallet with address ${address} not found`);
        }

        this.#currentWalletAddress = address;
        this.emit("current-wallet-changed", { address });
    }

    async getECDSAWalletAsync(address) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        if (!address) {
            throw new Error("No wallet selected");
        }

        const wallet = this.#wallets$$sensitive.find((wallet) => wallet.address === address);
        if (!wallet) {
            throw new Error(`Wallet not found for address: ${address}`);
        }

        return new ECDSA_Wallet(hexToBytes(wallet.seed), wallet.password);
    }

    // permissions
    #allowedOriginsSet = new Set();

    #checkUrl(url) {
        const urlObj = new URL(url);
        // Security check: don't allow file:// or other potentially unsafe protocols
        if (!["http:", "https:"].includes(urlObj.protocol)) {
            throw new Error(`Unsafe protocol not allowed: ${urlObj.protocol}`);
        }
        return urlObj;
    }

    async checkPermissionsAsync(url) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        try {
            const origin = this.#checkUrl(url).origin;
            return this.#allowedOriginsSet.has(origin);
        } catch (error) {
            console.error("Vault: Invalid URL provided to checkPermissionsAsync:", error);
            return false;
        }
    }

    async allowUrlAsync(url) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        try {
            const origin = this.#checkUrl(url).origin;
            this.#allowedOriginsSet.add(origin);
            this.emit("permission-granted", { origin });
        } catch (error) {
            console.error("Vault: Failed to allow URL:", error);
            throw new Error(`Invalid URL: ${error.message}`);
        }
    }

    async revokeUrlAsync(url) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        try {
            const origin = this.#checkUrl(url).origin;
            this.#allowedOriginsSet.delete(origin);
            this.emit("permission-revoked", { origin });
        } catch (error) {
            console.error("Vault: Failed to revoke URL:", error);
            throw new Error(`Invalid URL: ${error.message}`);
        }
    }

    getAllowedOrigins() {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }
        return Array.from(this.#allowedOriginsSet);
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

    // history
    async addHistoryAsync(entry) {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        const history = this.getHistoryAsync();
        history.push({ ...entry, time: Date.now() });
        if (history.length > this.#MAX_HISTORY_ENTRIES) {
            history.splice(0, history.length - this.#MAX_HISTORY_ENTRIES);
        }

        await this.#historyStorage.set(history, this.#encryptionKey);
        this.emit("history-updated");
    }

    async getHistoryAsync() {
        if (!this.isUnlocked) {
            throw new Error("Vault is locked");
        }

        let history = [];
        if (await this.#historyStorage.exists()) {
            history = await this.#historyStorage.get(this.#encryptionKey);
        }
        return history;
    }
}

const vault = new Vault();
export default vault;
