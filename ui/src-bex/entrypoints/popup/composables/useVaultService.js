import popupMessenger from "@bex/messaging/entrypointMessengers/popup";

class DynamicMessageService {
    constructor(messageID, sendMessageAsync, errorHandler) {
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
                    try {
                        return await sendMessageAsync(messageID, { method: prop, params });
                    } catch (error) {
                        if (errorHandler) {
                            errorHandler(error);
                        } else {
                            //console.error(error.message || error);
                            throw error;
                        }
                    }
                };
            },
        });
    }
}

// import { Notify } from "quasar";

// const errorHandler = (error) => {
//     console.error(error.message || error);
//     Notify.create({ type: "negative", message: error.message || error });
//     throw error;
// };

export const useVaultService = () => {
    //const isNotification = inject("isNotification");
    //const messageID = isNotification ? "notification/vault" : "popup/vault";
    const messageID = "popup/vault";
    const vaultService = new DynamicMessageService(messageID, popupMessenger.sendMessageAsync);

    return vaultService;
};
