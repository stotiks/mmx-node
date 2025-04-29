import { popupMessenger } from "@bex/messaging/popup";
const sendMessageAsync = async (payload) => await popupMessenger.sendMessageAsync("popup", payload);

class VaultApiService {
    constructor() {
        return new Proxy(this, {
            get(target, prop, receiver) {
                // Ignore internal props
                if (typeof target[prop] !== "undefined") {
                    return Reflect.get(target, prop, receiver);
                }

                // Return a function that calls the API dynamically
                return async (params) => {
                    const method = prop.replace(/Async$/, "");
                    return await sendMessageAsync({ method, params });
                };
            },
        });
    }
}

export const vaultApiService = new VaultApiService();
