import { popupMessenger } from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import { useTimeoutFn } from "@vueuse/core";

export const useNotificationMessageHandler = () => {
    const isNotification = inject("isNotification");

    const isLoading = ref(isNotification);
    const isMounted = ref(true);
    const isRunning = ref(false);

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
                const data = await showHandleRequestDialogAsync(params).catch(() => false);
                return { success: true, data };
            };
        }

        const notificationMessageHandler = new MessageHandler(NotificationMessageHandlerMethods);

        notificationMessageHandler.addPreHook(() => {
            if (isRunning.value === true) {
                throw new Error("Other request is running");
            }

            isRunning.value = true;
        });

        notificationMessageHandler.addSuccessHook(() => {
            isRunning.value = false;
            isLoading.value = false;
        });

        notificationMessageHandler.register(popupMessenger.onMessage, "notification");
        //isMounted.value = true;
        useTimeoutFn(() => {
            isLoading.value = false;
        }, 500);
    }

    return {
        isRunning: readonly(isRunning),
        isLoading: readonly(isLoading),
        isMounted: readonly(isMounted),
    };
};
