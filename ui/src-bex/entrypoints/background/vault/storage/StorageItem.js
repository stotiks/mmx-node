import { storage } from "@wxt-dev/storage";

export class StorageItem {
    #key;

    constructor(key) {
        this.#key = key;
    }

    get key() {
        return this.#key;
    }

    async existsAsync() {
        return (await storage.getItem(this.#key)) !== null;
    }

    async getAsync() {
        return await storage.getItem(this.#key);
    }

    async setAsync(data) {
        return await storage.setItem(this.#key, data);
    }

    async removeAsync() {
        return await storage.removeItem(this.#key);
    }
}
