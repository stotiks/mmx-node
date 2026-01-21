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

export class MmxProvider {
    isFurryVault = true;

    #sendMessageAsync = async (messageId, payload) => await windowMessenger.sendMessageAsync(messageId, payload);

    request = async (payload) => await this.#sendMessageAsync("request", payload);

    constructor() {
        windowMessenger.onMessage("message", (message) => {
            const { eventName, data } = message.data;
            this.emit(eventName, data);
            return { success: true };
        });

        return createReadonlyProxy(this);
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
    }
}
