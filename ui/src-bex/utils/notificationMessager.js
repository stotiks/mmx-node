import { openNotification, isNotificationLoaded } from "@bex/utils/openNotification";
import { internalMessenger } from "@bex/utils/internalMessenger";

export const notificationMessaging = {
    sendMessage: async (message) => {
        await openNotification();
        await internalMessenger.sendMessage("notification", message);
    },
};
