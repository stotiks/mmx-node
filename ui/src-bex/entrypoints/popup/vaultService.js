import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";

class DynamicMessageService {
    constructor(messageID, sendMessageAsync) {
        return new Proxy(this, {
            get(target, prop, receiver) {
                // Ignore internal props
                const value = Reflect.get(target, prop, receiver);
                if (typeof value !== "undefined") {
                    return value;
                }

                // Avoid proxying symbols or special properties like 'then'
                if (typeof prop !== "string" || prop === "then") {
                    return undefined;
                }

                // Return a function that calls the API dynamically
                return async (params) => {
                    return await sendMessageAsync(messageID, { method: prop, params });
                };
            },
        });
    }
}

export const vaultService = new DynamicMessageService("vault", popupMessenger.sendMessageAsync);
