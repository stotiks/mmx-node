import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export const useNotificationMessageHandler = () => {
    const $q = useQuasar();

    const showHandleRequestDialogAsync = (props) => {
        return new Promise((resolve) => {
            $q.dialog({
                component: defineAsyncComponent(
                    () => import("@bex/entrypoints/popup/components/dialogs/handleRequestDialog.vue")
                ),
                componentProps: props,
            })
                .onOk(({ accepted }) => {
                    resolve({ accepted });
                })
                .onCancel(() => {
                    resolve({ accepted: false });
                });
        });
    };

    class NotificationMessageHandlerMethods {
        static isRunning = false;
        static requestPermissions = async ({ url: _url, message }) => {
            if (this.isRunning === true) {
                throw new Error("Other request is running");
            }

            try {
                this.isRunning = true;
                const url = new URL(_url);
                const { accepted } = await showHandleRequestDialogAsync({ url, data: message.data }).catch(() => false);
                return { success: true, data: { accepted } };
            } finally {
                this.isRunning = false;
            }
        };
    }

    const notificationMessageHandler = new MessageHandlerBase(NotificationMessageHandlerMethods);
    notificationMessageHandler.register(popupMessenger.onMessage, "notification");
};
