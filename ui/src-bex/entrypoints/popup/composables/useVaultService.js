import popupMessenger from "@bex/messaging/entrypointMessengers/popup";

/**
 * Dynamically proxies method calls as message sends to the background vault service.
 * Any property access on the returned object becomes an async function that sends
 * a message with `{ method: propName, params }` to the background.
 */
class DynamicMessageService {
    constructor(messageID, sendMessageAsync) {
        return new Proxy(this, {
            get(target, prop, receiver) {
                // Return own properties as-is (e.g. class methods)
                const value = Reflect.get(target, prop, receiver);
                if (typeof value !== "undefined") {
                    return value;
                }

                // Avoid proxying symbols or Promise-detection props like 'then'
                if (typeof prop !== "string" || prop === "then") {
                    return undefined;
                }

                // Dynamically create an async method that forwards to the background
                return async (params) => {
                    return await sendMessageAsync(messageID, { method: prop, params });
                };
            },
        });
    }
}

export const useVaultService = () => {
    const messageID = "popup/vault";
    return new DynamicMessageService(messageID, popupMessenger.sendMessageAsync);
};
