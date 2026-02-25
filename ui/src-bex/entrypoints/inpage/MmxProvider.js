import windowMessenger from "@bex/messaging/entrypointMessengers/window";
import { createReadonlyProxy } from "./utils/createReadonlyProxy.js";

windowMessenger.setNamespace();

class MmxProvider {
    isFurryVault = true;

    #sendMessageAsync = async (messageId, payload) => await windowMessenger.sendMessageAsync(messageId, payload);

    request = async (payload) => await this.#sendMessageAsync("provider/request", payload);

    // Private events map - not accessible from outside
    #events = new Map();

    // Store proxy reference to prevent bypass via method chaining
    #proxy;

    constructor() {
        windowMessenger.onMessage("message", (message) => {
            const { eventName, data } = message.data;
            this.#emit(eventName, data);
            return { success: true };
        });

        this.#proxy = createReadonlyProxy(this);
        return this.#proxy;
    }

    // Public API for event listeners
    on = (eventName, callback) => {
        if (!this.#events.has(eventName)) {
            this.#events.set(eventName, []);
        }
        this.#events.get(eventName).push(callback);
        return this.#proxy;
    };

    removeListener(eventName, callback) {
        if (this.#events.has(eventName)) {
            const callbacks = this.#events.get(eventName);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
        return this.#proxy;
    }

    // Private emit method - only callable internally
    #emit(eventName, ...args) {
        if (this.#events.has(eventName)) {
            this.#events.get(eventName).forEach((callback) => {
                try {
                    callback(...args);
                } catch (err) {
                    console.error(`Error in ${eventName} handler:`, err);
                }
            });
        }
    }
}

// Freeze the prototype to prevent tampering
Object.freeze(MmxProvider.prototype);

export { MmxProvider };
