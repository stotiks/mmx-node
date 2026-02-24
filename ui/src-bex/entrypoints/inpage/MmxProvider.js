import windowMessenger from "@bex/messaging/entrypointMessengers/window";
windowMessenger.setNamespace();

const createReadonlyProxy = (obj) =>
    new Proxy(obj, {
        // Prevent modification of properties
        set(target, prop, value) {
            console.warn(`MmxProvider: Cannot set property '${String(prop)}' on readonly object`);
            return false;
        },
        deleteProperty(target, prop) {
            console.warn(`MmxProvider: Cannot delete property '${String(prop)}' from readonly object`);
            return false;
        },
        // Prevent extending the object with new properties
        defineProperty(target, prop, descriptor) {
            console.warn(`MmxProvider: Cannot define property '${String(prop)}' on readonly object`);
            return false;
        },
        setPrototypeOf(target, proto) {
            console.warn("MmxProvider: Cannot change prototype of readonly object");
            return false;
        },
        // Prevent prototype chain inspection/mutation
        getPrototypeOf() {
            return null;
        },
        // Prevent introspection of property descriptors
        getOwnPropertyDescriptor(target, prop) {
            const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
            if (descriptor) {
                return {
                    ...descriptor,
                    writable: false,
                    configurable: false,
                };
            }
            return descriptor;
        },
        // Allow reading properties
        get(target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            // Return a readonly wrapper for functions
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        },
    });

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
