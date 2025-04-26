import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

const waitForValue = async ({
    getter,
    condition = (value) => Boolean(value),
    timeout = 10000,
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

                if (Date.now() - startTime > timeout) {
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

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";

export const useNotificationMessageHandler = () => {
    const $q = useQuasar();
    const vaultStore = useVaultStore();
    const { isLocked } = storeToRefs(vaultStore);

    class NotificationMessageHandler extends MessageHandlerBase {
        static requestPermissions = async ({ url: _url }) => {
            const url = new URL(_url);
            const message = "requestPermissions for: " + url.origin;

            if (isLocked.value) {
                const dismiss = $q.notify({
                    type: "secondary",
                    message: message,
                    caption: "Unlock the vault to continue...",
                    timeout: 0,
                });

                try {
                    await waitForValue({
                        getter: () => isLocked.value,
                        condition: (value) => value === false,
                        description: "vault to be unlocked",
                        timeout: 30_000,
                    });
                } finally {
                    dismiss();
                }
            }

            const granted = await new Promise((resolve) => {
                $q.notify({
                    type: "secondary",
                    message: message,
                    timeout: 0,
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

            console.log("granted:", granted);
            return { success: true, data: { message: "Return from notification", granted } };
        };
    }

    popupMessenger.onMessage("notification", async (message) => {
        console.log("Received from background:", JSON.parse(JSON.stringify(message)));
        return await NotificationMessageHandler.handleAsync(message);
    });
};
