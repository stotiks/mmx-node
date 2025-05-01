import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

const waitForValue = async ({
    getter,
    condition = (value) => Boolean(value),
    timeout = -1,
    interval = 100,
    description = "value to change",
}) => {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            try {
                const currentValue = getter();

                if (condition(currentValue)) {
                    resolve(currentValue);
                    return;
                }

                if (timeout != -1 && Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for ${description}`));
                    return;
                }

                setTimeout(check, interval);
            } catch (error) {
                reject(error);
            }
        };

        check();
    });
};

const promiseWithTimeout = (promise, timeoutMs, description = "response") => {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            //reject(new Error(`Promise timed out after ${timeoutMs}ms`));
            reject(new Error(`Timeout waiting for ${description}`));
        }, timeoutMs);
    });

    // Race the original promise against the timeout
    return Promise.race([promise, timeoutPromise]);
};

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";

export const useNotificationMessageHandler = () => {
    const $q = useQuasar();
    const vaultStore = useVaultStore();
    const { isLocked } = storeToRefs(vaultStore);

    class NotificationMessageHandler extends MessageHandlerBase {
        static requestPermissions = async ({ url: _url }) => {
            const url = new URL(_url);
            const message = "requestPermissions for: " + url.origin;

            const timeout = 6_000;

            const showNotification = async () => {
                let notification = null;
                if (isLocked.value) {
                    notification = $q.notify({
                        group: false, // required to be updatable
                        type: "secondary",
                        message: message,
                        caption: "Unlock the vault to continue...",
                        timeout: timeout,
                        progress: true,
                    });
                }
                await waitForValue({
                    getter: () => isLocked.value,
                    condition: (value) => value === false,
                });

                const granted = await new Promise((resolve) => {
                    if (notification === null) {
                        notification = $q.notify;
                    }
                    notification({
                        type: "secondary",
                        message: message,
                        caption: "Unlock the vault to continue...",
                        timeout: timeout,
                        progress: true,
                        actions: [
                            {
                                label: "Allow",
                                color: "positive",
                                handler: () => {
                                    resolve(true);
                                },
                            },
                            {
                                label: "Deny",
                                color: "negative",
                                handler: () => {
                                    resolve(false);
                                },
                            },
                        ],
                    });
                });

                return granted;
            };

            const grantedPromise = new Promise((resolve) => {
                showNotification().then((granted) => {
                    resolve(granted);
                });
            });

            let granted = false;
            granted = await promiseWithTimeout(grantedPromise, timeout);

            // const granted = await
            // console.log("granted:", granted);
            //const granted = await grantedPromise;

            // const granted = await promiseWithTimeout(async () => {
            //     console.log("isLocked:", isLocked.value);
            //     let notification;
            //     if (isLocked.value) {
            //         notification = $q.notify({
            //             type: "secondary",
            //             message: message,
            //             caption: "Unlock the vault to continue...",
            //             timeout: 0,
            //         });
            //         // const dismiss = $q.notify({
            //         //     type: "secondary",
            //         //     message: message,
            //         //     caption: "Unlock the vault to continue...",
            //         //     timeout: 0,
            //         // });

            //         // try {
            //         //     await waitForValue({
            //         //         getter: () => isLocked.value,
            //         //         condition: (value) => value === false,
            //         //     });
            //         // } finally {
            //         //     dismiss();
            //         // }
            //     }

            //     // const granted = await new Promise((resolve) => {
            //     //     $q.notify({
            //     //         type: "secondary",
            //     //         message,
            //     //         timeout,
            //     //         progress: true,
            //     //         actions: [
            //     //             {
            //     //                 label: "Allow",
            //     //                 color: "positive",
            //     //                 handler: () => {
            //     //                     resolve(true);
            //     //                 },
            //     //             },
            //     //             {
            //     //                 label: "Deny",
            //     //                 color: "negative",
            //     //                 handler: () => {
            //     //                     resolve(false);
            //     //                 },
            //     //             },
            //     //         ],
            //     //     });
            //     // }, timeout);

            //     // return granted;
            // }, timeout);

            console.log("granted:", granted);
            return { success: true, data: { message: "Return from notification", granted } };
        };
    }

    popupMessenger.onMessage("notification", async (message) => {
        console.log("Received from background:", JSON.parse(JSON.stringify(message)));
        return await NotificationMessageHandler.handleAsync(message);
    });
};
