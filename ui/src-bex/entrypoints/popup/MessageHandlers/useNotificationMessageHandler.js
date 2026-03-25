import popupMessenger from "@bex/messaging/entrypointMessengers/popup";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import { useTimeoutFn } from "@vueuse/core";

const useShowHandleRequestDialogAsync = () => {
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

    return {
        showHandleRequestDialogAsync,
    };
};

export const useNotificationMessageHandler = () => {
    const isNotification = inject("isNotification");

    const isLoading = ref(isNotification);
    const isMounted = ref(true);
    const isRunning = ref(false);

    if (isNotification) {
        const { showHandleRequestDialogAsync } = useShowHandleRequestDialogAsync();

        class NotificationMessageHandlerMethods {
            static requestPermissionsAndAccept = async (params) => {
                isLoading.value = false;

                if (isRunning.value === true) {
                    throw new Error("Other request is running");
                }

                isRunning.value = true;

                try {
                    return await showHandleRequestDialogAsync(params);
                } finally {
                    // isLoading.value = false;
                }
            };

            static setResult = async (params) => {
                isRunning.value = false;
                console.log("setResult", params);
            };
        }

        const notificationMessageHandler = new MessageHandler(NotificationMessageHandlerMethods);

        notificationMessageHandler.register(popupMessenger.onMessage, "notification/request");
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
