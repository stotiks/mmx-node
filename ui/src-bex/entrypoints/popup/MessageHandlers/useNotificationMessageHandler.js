import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";

export const useNotificationMessageHandler = () => {
    const isLoading = ref(false);
    const isMounted = ref(false);

    const isNotification = inject("isNotification");
    if (isNotification) {
        const $q = useQuasar();

        const showHandleRequestDialogAsync = (props) => {
            return new Promise((resolve) => {
                $q.dialog({
                    component: defineAsyncComponent(
                        () => import("@bex/entrypoints/popup/components/dialogs/HandleRequestDialog")
                    ),
                    componentProps: props,
                })
                    .onOk((data) => {
                        resolve(data);
                    })
                    .onCancel((data) => {
                        resolve(data);
                    });
            });
        };

        class NotificationMessageHandlerMethods {
            // dummy method for testing
            static dummy = async () => {};

            static requestPermissionsAndAccept = async (params) => {
                if (isLoading.value === true) {
                    throw new Error("Other request is running");
                }

                try {
                    isLoading.value = true;
                    const data = await showHandleRequestDialogAsync(params).catch(() => false);
                    return { success: true, data };
                } finally {
                    isLoading.value = false;
                }
            };
        }

        class MessageHandlerNotification extends MessageHandler {
            async handleAsync(message) {
                return await super.handleAsync(message).finally(() => {
                    isMounted.value = true;
                });
            }
        }

        const notificationMessageHandler = new MessageHandlerNotification(NotificationMessageHandlerMethods);
        notificationMessageHandler.register(popupMessenger.onMessage, "notification");
    } else {
        isMounted.value = true;
    }

    return { isLoading, isMounted };
};
