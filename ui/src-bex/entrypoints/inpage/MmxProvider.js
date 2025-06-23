import { windowMessenger } from "@bex/messaging/entrypointMessengers/window";
windowMessenger.setNamespace();

const proxify = (obj) =>
    new Proxy(obj, {
        /////deleteProperty: () => !0,
        // get(target, prop, receiver) {
        //     const originalMethod = target[prop];
        //     if (typeof originalMethod === "function") {
        //         return function (...args) {
        //             console.log(`Calling method: ${prop} with arguments:`, args);
        //             const result = originalMethod.apply(this, args);
        //             console.log(`Method ${prop} returned:`, result);
        //             return result;
        //         };
        //     }
        //     return Reflect.get(target, prop, receiver);
        // },
    });

export class MmxProvider {
    isFurryVault = true;

    network = "mainnet";

    // selectedAddress = null;

    #sendMessageAsync = async (messageId, payload) => await windowMessenger.sendMessageAsync(messageId, payload);

    request = async (payload) => await this.#sendMessageAsync("request", payload);

    constructor() {
        windowMessenger.onMessage("message", (message) => {
            const { eventName, data } = message.data;
            this.emit(eventName, data);
        });

        return proxify(this);
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
