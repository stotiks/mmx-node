import { storage } from "@wxt-dev/storage";
import { decrypt, encrypt } from "@metamask/browser-passworder";

export class StorageItem {
    #itemName;

    constructor(storageItemName) {
        this.#itemName = storageItemName;
    }

    async exists() {
        return (await storage.getItem(this.#itemName)) !== null;
    }

    async get() {
        return await storage.getItem(this.#itemName);
    }

    async set(data) {
        return await storage.setItem(this.#itemName, data);
    }

    async remove() {
        return await storage.removeItem(this.#itemName);
    }
}

export class EncryptedStorageItem extends StorageItem {
    async get(password) {
        const encrypted = await super.get();
        return await decrypt(password, encrypted);
    }

    async set(data, password) {
        const encrypted = await encrypt(password, data);
        return await super.set(encrypted);
    }
}
