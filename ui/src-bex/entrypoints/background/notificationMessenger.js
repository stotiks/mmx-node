import { openNotification } from "@bex/entrypoints/background/openNotification";
import { internalMessenger } from "@bex/messaging/background";

export const notificationMessenger = {
    sendMessage: async (data) => {
        await openNotification();
        await internalMessenger.sendMessage("notification", data, "popup");
    },
};
