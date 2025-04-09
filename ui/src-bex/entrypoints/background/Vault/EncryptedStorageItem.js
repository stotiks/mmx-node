import { storage } from "@wxt-dev/storage";
import { decrypt, encrypt } from "@metamask/browser-passworder";

export class EncryptedStorageItem {
    #storageItemName;

    constructor(storageItemName) {
        this.#storageItemName = storageItemName;
    }

    async exists() {
        return (await storage.getItem(this.#storageItemName)) !== null;
    }

    async get(password) {
        const encrypted = await storage.getItem(this.#storageItemName);
        return await decrypt(password, encrypted);
    }

    async set(data, password) {
        const encrypted = await encrypt(password, data);
        return await storage.setItem(this.#storageItemName, encrypted);
    }

    async remove() {
        return await storage.removeItem(this.#storageItemName);
    }
}
