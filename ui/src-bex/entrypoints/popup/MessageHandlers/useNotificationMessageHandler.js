import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export const useNotificationMessageHandler = () => {
    const $q = useQuasar();

    const showHandleRequestDialogAsync = (props) => {
        return new Promise((resolve) => {
            $q.dialog({
                component: defineAsyncComponent(
                    () => import("@bex/entrypoints/popup/components/dialogs/HandleRequestDialog/index.vue")
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
        static isRunning = false;
        static requestPermissions = async (params) => {
            console.log("requestPermissions:", params);
            if (this.isRunning === true) {
                throw new Error("Other request is running");
            }

            try {
                this.isRunning = true;
                const data = await showHandleRequestDialogAsync(params).catch(() => false);
                return { success: true, data };
            } finally {
                this.isRunning = false;
            }
        };
    }

    const notificationMessageHandler = new MessageHandlerBase(NotificationMessageHandlerMethods);
    notificationMessageHandler.register(popupMessenger.onMessage, "notification");
};
