import { popupMessenger } from "@bex/messaging/popup";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export const useNotificationMessageHandler = () => {
    const $q = useQuasar();

    class NotificationMessageHandler extends MessageHandlerBase {
        static requestPermissions = async ({ url }) => {
            $q.notify({ type: "warning", message: "requestPermissions for: " + JSON.stringify(url) });
            return { success: true, data: { message: "Return from notification", granted: true } };
        };
    }

    popupMessenger.onMessage("notification", async (message) => {
        console.log("Received from background:", JSON.parse(JSON.stringify(message)));
        return await NotificationMessageHandler.handleAsync(message);
    });
};
