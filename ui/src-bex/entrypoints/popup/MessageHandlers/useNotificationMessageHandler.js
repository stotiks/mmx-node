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

    let isRunning = false;
    class NotificationMessageHandler extends MessageHandlerBase {
        static requestPermissions = async ({ url: _url, message }) => {
            if (isRunning === true) {
                throw new Error("Other request is running");
            }

            try {
                isRunning = true;
                const url = new URL(_url);
                const { accepted } = await showHandleRequestDialogAsync({ url, data: message.data }).catch(() => false);
                return { success: true, data: { accepted } };
            } finally {
                isRunning = false;
            }
        };
    }

    popupMessenger.onMessage("notification", async (message) => {
        console.log("Received from background:", JSON.parse(JSON.stringify(message)));
        return await NotificationMessageHandler.handleAsync(message);
    });
};
