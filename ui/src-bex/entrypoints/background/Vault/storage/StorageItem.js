import { storage } from "@wxt-dev/storage";

export class StorageItem {
    #storageItemKey;

    constructor(storageItemKey) {
        this.#storageItemKey = storageItemKey;
    }

    async existsAsync() {
        return (await storage.getItem(this.#storageItemKey)) !== null;
    }

    async getAsync() {
        return await storage.getItem(this.#storageItemKey);
    }

    async setAsync(data) {
        return await storage.setItem(this.#storageItemKey, data);
    }

    async removeAsync() {
        return await storage.removeItem(this.#storageItemKey);
    }
}
