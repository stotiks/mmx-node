import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export const useNotificationMessageHandler = () => {
    const isNotification = inject("isNotification");

    const isRunning = ref(false);
    const isLoading = ref(true);

    if (!isNotification) {
        isLoading.value = false;
        return { isRunning, isLoading };
    }

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
        static dummy = () => {};

        static requestPermissionsAndAccept = async (params) => {
            if (isRunning.value === true) {
                throw new Error("Other request is running");
            }

            try {
                isRunning.value = true;
                const data = await showHandleRequestDialogAsync(params).catch(() => false);
                return { success: true, data };
            } finally {
                isRunning.value = false;
            }
        };
    }

    class MessageHandlerNotification extends MessageHandlerBase {
        async handleAsync(message) {
            return await super.handleAsync(message).finally(() => {
                isLoading.value = false;
            });
        }
    }

    const notificationMessageHandler = new MessageHandlerNotification(NotificationMessageHandlerMethods);
    notificationMessageHandler.register(popupMessenger.onMessage, "notification");

    return { isRunning, isLoading };
};
