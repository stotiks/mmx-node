import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";

class DynamicMessageService {
    constructor(messageID) {
        return new Proxy(this, {
            get(target, prop, receiver) {
                // Ignore internal props
                if (typeof target[prop] !== "undefined") {
                    return Reflect.get(target, prop, receiver);
                }

                // Return a function that calls the API dynamically
                return async (params) => {
                    const method = prop;
                    const sendMessageAsync = async (payload) =>
                        await popupMessenger.sendMessageAsync(messageID, payload);
                    return await sendMessageAsync({ method, params });
                };
            },
        });
    }
}

export const vaultService = new DynamicMessageService("vault");
